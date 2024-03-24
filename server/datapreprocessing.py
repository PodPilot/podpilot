from langchain_community.document_loaders import YoutubeLoader
from langchain_community.document_loaders.merge import MergedDataLoader
from llm import get_anthropic_llm, get_openai_llm, get_faster_model
from prompts import get_name, get_matching_titles
from collections import defaultdict
import ast
import langchain 
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os
from modal import Stub

def get_podcast_transcripts():
  videos = ["n9IxomBusuw", "ufsIA5NARIo", "DTCmprPCDqc", "iOvvw3jb6cs", "XcvhERcZpWw", "Rtv-W7IE4Mw"]
  loaders = []
  for video in videos:
      loader = YoutubeLoader.from_youtube_url(
          f"https://www.youtube.com/watch?v={video}", add_video_info=True
      )
      loaders.append(loader)
      
  loader_all = MergedDataLoader(loaders=loaders)
  docs = loader_all.load()
  return docs, loaders

def get_names_from_query(query):
  llm = get_faster_model()
  prompt = get_name(query)
  response = llm.invoke(prompt)
  content = response.content
  res = list(map(lambda x : x.replace("'",""), content.strip('][').split(', ')))
  return res

def get_titles(documents):
  title_to_doc = defaultdict(list)
  
  for doc in documents:
      title_to_doc[doc.metadata['title']].append(doc)
      
  return list(title_to_doc.keys())

def get_titles_that_match_names(documents, names):
  llm = get_faster_model()
  titles = get_titles(documents)
  prompt = get_matching_titles(names, titles)
  response = llm.invoke(prompt)
  content = response.content
  print(content)
  res = ast.literal_eval(content)
  return res
  # res = list(map(lambda x : x.replace("'",""), content.strip('][').split(', ')))
  
def get_vector_from_documents(docs, embeddings):
  text_splitter = RecursiveCharacterTextSplitter()
  documents = text_splitter.split_documents(docs)
  vector = Chroma.from_documents(documents, embeddings)
  return vector