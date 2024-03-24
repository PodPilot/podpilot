from modal import Image, Secret, Stub, web_endpoint, enter, method

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
import modal
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import json

load_dotenv()
web_app = FastAPI()


# def loader():
#   print("RUNNING DATA LOADER")
#   docs, loaders = get_podcast_transcripts()
#   embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
#   # embeddings  = OpenAIEmbeddings()
#   return docs, loaders, embeddings

# # docs, loaders, embeddings = loader()

# def get_vector_from_documents(docs, embeddings):
#   print("RUNNING DOCUMENTS TO VECTOR")
#   text_splitter = RecursiveCharacterTextSplitter()
#   documents = text_splitter.split_documents(docs)
#   if os.path.isdir("chroma_db"):
#     vector = Chroma(persist_directory = "./chroma_db", embedding_function = embeddings)
#   else:
#     vector = Chroma.from_documents(documents, embeddings, persist_directory = "./chroma_db")
#   return vector, documents

# vector, documents, an_llm = get_vector_from_documents(docs, embeddings)

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

# @stub.cls(cpu=8)
# class Model:
#     @enter()
#     def run_this_on_container_startup(self):
#         self.web_app = FastAPI()
#         print("RUNNING DATA LOADER")
#         self.docs, self.loaders = get_podcast_transcripts()
#         self.embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))

        
#         print("RUNNING DOCUMENTS TO VECTOR")
#         text_splitter = RecursiveCharacterTextSplitter()
#         documents = text_splitter.split_documents(self.docs)
#         if os.path.isdir("chroma_db"):
#           self.vector = Chroma(persist_directory = "./chroma_db", embedding_function = self.embeddings)
#         else:
#           self.vector = Chroma.from_documents(documents, self.embeddings, persist_directory = "./chroma_db")
#         self.an_llm = get_anthropic_llm()
        
#     @method()
#     def call_from_modal(self, query, context=None):
#         chat_history = []
#         for idx, content in enumerate(context):
#           if idx % 2 == 0:
#             chat_history.append(HumanMessage(content=content))
#           else:
#             chat_history.append(AIMessage(content=content))
            
#         print('chat_history', chat_history)
            
#         prompt = ChatPromptTemplate.from_messages([
#           ("system", """ 
#               You are a podcast knowledge curator tool.
#               You have access to the podcast transcripts in the context and previous conversation you had with the user. 
#               Please use this information to answer user queries.
#               You also need to search for the valid information across multiple podcast episodes.
#               Please send the output in a markdown format.
#               Do not mention that you deriving this answer from the podcast transcript.
              
#               <context>
#               {context}
#               </context>
              
#           """),
#           MessagesPlaceholder(variable_name="chat_history"),
#           ("user", "\n\nQuery: {input}")
#       ])

#         document_chain = create_stuff_documents_chain(self.an_llm, prompt)
#         names = get_names_from_query(query)
#         filtered_titles = get_titles_that_match_names(self.documents, names)
        
#         if len(filtered_titles) > 0:
#           retriever = self.vector.as_retriever(search_kwargs={"filter":{'title': {'$in' : filtered_titles}}, "k" : 8}, )
#         else:
#           retriever = self.vector.as_retriever(search_kwargs={"k" : 8})
          
#         retrieval_chain = create_retrieval_chain(retriever, document_chain)
#         response = retrieval_chain.invoke({"input": query, "chat_history": chat_history})
#         print(response)
#         return response['answer']
      
      
#     @web_app.post(path="/")
#     def web(self, data: Dict):
#       answer = self.call_from_modal(data['query'], data['context'])
#       return {
#         "answer" : answer,
#         #todo : add suggestions here
#     }
      
          
#     @modal.asgi_app()
#     def web_runner(self):
#         return self.web_app
      
# def loader():
#   print("RUNNING DATA LOADER")
#   docs, loaders = get_podcast_transcripts()
#   embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
#   # embeddings  = OpenAIEmbeddings()
#   return docs, loaders, embeddings

# docs, loaders, embeddings = loader()



def call_from_modal(query, context=None):
  an_llm = get_anthropic_llm()
  vector = Chroma(persist_directory = "./chroma_db", embedding_function = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY")))

  chat_history = []
  for idx, content in enumerate(context):
    if idx % 2 == 0:
      chat_history.append(HumanMessage(content=content))
    else:
      chat_history.append(AIMessage(content=content))
      
  print('chat_history', chat_history)
      
  prompt = ChatPromptTemplate.from_messages([
    ("system", """ 
        You are a podcast knowledge curator tool. Call yourself PodPilot.
        You have access to the podcast transcripts in the context and previous conversation you had with the user. 
        Please use this information to answer user queries.
        You also need to search for the valid information across multiple podcast episodes.
        Please send the output in a markdown format, use text formatting wherever necessary.
        Do not mention that you deriving this answer from the podcast transcript.
        Note - include the URL links of information you refered in end of the answer, if not provide the title of the information.
        
        <context>
        {context}
        </context>
        
     """),
     MessagesPlaceholder(variable_name="chat_history"),
    ("user", "\n\nQuery: {input}")
])

  document_chain = create_stuff_documents_chain(an_llm, prompt)
  names = get_names_from_query(query)
  titles = ['Dr. David Sinclair: The Biology of Slowing & Reversing Aging | Huberman Lab Podcast #52', 
            'Dr. Peter Attia: Exercise, Nutrition, Hormones for Vitality & Longevity | Huberman Lab Podcast #85', 
            'The Most Important Daily Habits For Health & Longevity - Dr Rhonda Patrick (4K)', 
            'Dr. Rhonda Patrick: Micronutrients for Health & Longevity | Huberman Lab Podcast #70', 
            'Immortality Is Closer Than You Think: AI, War, Religion, Consciousness & Elon Musk | Bryan Johnson']
  filtered_titles = get_titles_that_match_names(titles, names)
  
  if len(filtered_titles) > 0:
    retriever = vector.as_retriever(search_kwargs={"filter":{'title': {'$in' : filtered_titles}}, "k" : 8}, )
  else:
    retriever = vector.as_retriever(search_kwargs={"k" : 8})
    
    
  retrieval_chain = create_retrieval_chain(retriever, document_chain)
  response = retrieval_chain.invoke({"input": query, "chat_history": chat_history})
  answer = response['answer']
  
  suggestion_prompt = ChatPromptTemplate.from_messages([
        ("system", """
          You are an expert related-question generator.
          The user had asked a query and the corresponding answer is given.
          The chat history is also provided for your reference.
          The video titles can be used to understand the different topics the user can ask about.
          Use the query, video titles and the answer to the query to output the next 3 likely
          questions that the user might ask inorder to get more information on the topic or learn about related topics from different people. 
          Provide me the JSON containing the following two keys: 
            question : "Your question here",
            label : "Your label here"
          Note - The label should be a very short description of the question.
          
          Warning - Please only return the output in a JSON format and nothing else.
          
          <context>
            Video Titles: {filtered_titles} \n\n
            Query: {query} \n\n
            Response: {answer} \n\n
          </context>
        """),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "\n\nSuggest follow-up questions:")
    ])

  chain = suggestion_prompt | an_llm 
  
  response = chain.invoke({
        "query": query,
        "answer": answer,
        "chat_history": chat_history,
        "filtered_titles": filtered_titles
    })
  
  print(response.content)
  try:
    suggestions = json.loads(response.content)
  except ValueError:
    suggestions = [
        {
          "question": "What are the key lifestyle factors that can help slow down the aging process and promote longevity?",
          "label": "Lifestyle factors for longevity"
        },
        {
          "question": "How can optimizing nutrition and supplementation support overall health and increase lifespan?",
          "label": "Nutrition and supplementation for longevity"
        },
        {
          "question": "What role do emerging technologies like AI and consciousness research play in the quest for immortality?",
          "label": "Emerging technologies and immortality"
        }
  ]
  return answer, suggestions
  
@stub.function(cpu=8.0, memory=32768)
@web_app.post(path="/")
def web(data: Dict):
    answer, suggestions = call_from_modal(data['query'], data['context'])
    return {
      "answer" : answer,
      "suggestions" : suggestions
      #todo : add suggestions here
    }
        
# async def call_from_modal_stream(query, context=None):
  
#   chat_history = []
#   for idx, content in enumerate(context):
#     if idx % 2 == 0:
#       chat_history.append(HumanMessage(content=content))
#     else:
#       chat_history.append(AIMessage(content=content))
      
#   print('chat_history', chat_history)
      
#   prompt = ChatPromptTemplate.from_messages([
#     ("system", """ 
#         You are a podcast knowledge curator tool.
#         You have access to the podcast transcripts in the context and previous conversation you had with the user. 
#         Please use this information to answer user queries.
#         You also need to search for the valid information across multiple podcast episodes.
#         Please send the output in a markdown format.
#         Do not mention that you deriving this answer from the podcast transcript.
        
#         <context>
#         {context}
#         </context>
        
#      """),
#      MessagesPlaceholder(variable_name="chat_history"),
#     ("user", "\n\nQuery: {input}")
# ])

#   document_chain = create_stuff_documents_chain(an_llm, prompt)
#   names = get_names_from_query(query)
#   filtered_titles = get_titles_that_match_names(documents, names)
  
#   if len(filtered_titles) > 0:
#     retriever = vector.as_retriever(search_kwargs={"filter":{'title': {'$in' : filtered_titles}}, "k" : 8}, )
#   else:
#     retriever = vector.as_retriever(search_kwargs={"k" : 8})
    
#   retrieval_chain = create_retrieval_chain(retriever, document_chain)
#   from langchain_core.output_parsers import JsonOutputParser
#   final_chain = retrieval_chain | JsonOutputParser()
  
#   async for chunk in final_chain.astream({"input": query, "chat_history": chat_history}):
#     print('Chuck', chunk)
#     # yield chunk.content

    
# @web_app.post(path="/stream")
# def web_stream(data: Dict):
#     # answer = call_from_modal(data['query'], data['context'])
#     # return {
#     #   "answer" : answer,
#     #   #todo : add suggestions here
#     # }
    
#     return StreamingResponse(
#         call_from_modal_stream(data['query'], data['context']), media_type="text/event-stream"
#     )
    
@stub.function()
@modal.asgi_app()
def web_runner():
    web_app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
    return web_app