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
from typing import Dict
from langchain_core.prompts import MessagesPlaceholder
from langchain.chains import create_history_aware_retriever
from langchain_core.messages import HumanMessage, AIMessage

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
  if os.path.isdir("chroma_db"):
    vector = Chroma(persist_directory = "./chroma_db", embedding_function = embeddings)
  else:
    vector = Chroma.from_documents(documents, embeddings, persist_directory = "./chroma_db")
  an_llm = get_anthropic_llm()
  return vector, documents, an_llm

vector, documents, an_llm = get_vector_from_documents(docs, embeddings)

def call_from_modal(query, context=None):
  
  chat_history = []
  for idx, content in enumerate(context):
    if idx % 2 == 0:
      chat_history.append(HumanMessage(content=content))
    else:
      chat_history.append(AIMessage(content=content))
      
  print('chat_history', chat_history)
      
  prompt = ChatPromptTemplate.from_messages([
    ("system", """ 
        You are a podcast knowledge curator tool.
        You have access to the podcast transcripts in the context and previous conversation you had with the user. 
        Please use this information to answer user queries.
        You also need to search for the valid information across multiple podcast episodes.
        Please send the output in a markdown format.
        
        <context>
        {context}
        </context>
        
     """),
     MessagesPlaceholder(variable_name="chat_history"),
    ("user", "\n\nQuery: {input}")
])

  document_chain = create_stuff_documents_chain(an_llm, prompt)
  names = get_names_from_query(query)
  filtered_titles = get_titles_that_match_names(documents, names)
  
  if len(filtered_titles) > 0:
    retriever = vector.as_retriever(search_kwargs={"filter":{'title': {'$in' : filtered_titles}}, "k" : 8}, )
  else:
    retriever = vector.as_retriever(search_kwargs={"k" : 8})
    
  retrieval_chain = create_retrieval_chain(retriever, document_chain)
  response = retrieval_chain.invoke({"input": query, "chat_history": chat_history})
  print(response)
  return response['answer']
  
@stub.function(cpu=8.0, memory=32768)
@web_endpoint(method="POST")
def web(data: Dict):
    answer = call_from_modal(data['query'], data['context'])
    return {
      "answer" : answer,
      #todo : add suggestions here
    }
    
@stub.function()
def cli(query: str):
    answer = call_from_modal(query)
    # Terminal codes for pretty-printing.
    bold, end = "\033[1m", "\033[0m"

    print(f"🦜 {bold}ANSWER:{end}")
    print(answer)