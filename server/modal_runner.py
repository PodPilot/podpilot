from modal import Image, Secret, Stub, web_endpoint
from datapreprocessing import get_podcast_transcripts, get_names_from_query, get_titles_that_match_names
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from llm import get_anthropic_llm
from langchain.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from dotenv import load_dotenv
import os
load_dotenv()

image = Image.from_registry("ubuntu:22.04", add_python="3.10").pip_install(
    # langchain pkgs
    "faiss-cpu~=1.7.3",
    "langchain-anthropic~=0.1.4",
    "langchain-openai~=0.1.0",
    "langchain~=0.1.12",
    "chromadb~=0.4.24",
    "openai~=1.14.2",
    "langchain-community~=0.0.28",
    "langchain-core~=0.1.33",
    "langchain-text-splitters~=0.0.1",
    "youtube-transcript-api~=0.6.2",
    "pytube~=15.0.0",
).apt_install("sqlite3", "libsqlite3-dev", "libreadline-dev", "wget")

# .run_commands(
#   "wget https://sqlite.org/2021/sqlite-autoconf-3350400.tar.gz",
#   "tar -xvf sqlite-autoconf-3350400.tar.gz",
#   "./sqlite-autoconf-3350400/configure",
#   "make",
#   "dpkg --remove --force-remove-reinstreq sqlite3",
#   "make install",
#   'export PATH="/usr/local/bin:$PATH"',
#   "sqlite3 --version"
#   )

stub = Stub(
    name="example-langchain-qanda",
    image=image,
    secrets=[Secret.from_name("openai-secret"), Secret.from_name("anthropic-secret")],
)

def loader():
  docs, loaders = get_podcast_transcripts()
  embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
  # embeddings  = OpenAIEmbeddings()
  return docs, loaders, embeddings
  
docs, loaders, embeddings = loader()

def get_vector_from_documents(docs, embeddings):
  text_splitter = RecursiveCharacterTextSplitter()
  documents = text_splitter.split_documents(docs)
  vector = Chroma.from_documents(documents, embeddings)
  an_llm = get_anthropic_llm()
  return vector, documents, an_llm

vector, documents, an_llm = get_vector_from_documents(docs, embeddings)

prompt = ChatPromptTemplate.from_messages([
    ("system", """ 
        You are knowledge curator tool.
        You have access to the podcast transcripts in the context and can use the information to answer user queries.
        You also need to search for the information across multiple podcast episodes.
        Please send the output in a markdown format.
        
        <context>
        {context}
        </context>
        
     """),
    ("user", "Query: {input}")
])
document_chain = create_stuff_documents_chain(an_llm, prompt)

def call_from_modal(query):
  names = get_names_from_query(query)
  filtered_titles = get_titles_that_match_names(documents, names)
  retriever = vector.as_retriever(search_kwargs={"filter":{'title': {'$in' : filtered_titles}}, "k" : 6}, )
  retrieval_chain = create_retrieval_chain(retriever, document_chain)
  response = retrieval_chain.invoke({"input": query})
  return response['answer']
  
@stub.function()
@web_endpoint(method="GET")
def web(query: str):
    answer = call_from_modal(query)
    return {
      "answer" : answer
    }
    
@stub.function()
def cli(query: str, show_sources: bool = False):
    answer = call_from_modal(query)
    # Terminal codes for pretty-printing.
    bold, end = "\033[1m", "\033[0m"

    print(f"🦜 {bold}ANSWER:{end}")
    print(answer)