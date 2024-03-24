from datapreprocessing import get_podcast_transcripts, get_matching_titles, get_titles, get_names_from_query, get_titles_that_match_names
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from llm import get_anthropic_llm
from langchain.prompts import ChatPromptTemplate


docs, loaders = get_podcast_transcripts()
embeddings = OpenAIEmbeddings()

def get_vector_from_documents(docs, embeddings):
  text_splitter = RecursiveCharacterTextSplitter()
  documents = text_splitter.split_documents(docs)
  vector = Chroma.from_documents(documents, embeddings)
  return vector, documents

vector, documents = get_vector_from_documents(docs, embeddings)

an_llm = get_anthropic_llm()
prompt = ChatPromptTemplate.from_template("""
    You have access to the podcast transcripts in the context and can use the information to answer questions. 
    You also need to search for the information across multiple podcast episodes.
    Also mention the speaker's name when providing the answer. 

    <context>
    {context}
    </context>

    Question: {input}""")
document_chain = create_stuff_documents_chain(an_llm, prompt)


query = "What did Rhonda Patrick talk about in the podcast episode with Andrew Huberman?"
names = get_names_from_query(query)


filtered_titles = get_titles_that_match_names(documents, names)


from langchain.chains import create_retrieval_chain
# retriever = vector.as_retriever(search_type="mmr", search_kwargs={"score_threshold": 0.5})
retriever = vector.as_retriever(search_kwargs={"filter":{'title': {'$in' : filtered_titles}}, "k" : 6}, )
retrieval_chain = create_retrieval_chain(retriever, document_chain)


response = retrieval_chain.invoke({"input": query})


print(response['answer'])
