
def get_name(query=""):
  return f"""
  Are there any names mentioned in the query? 
  If yes just return the list of names.
  If no, return an empty list.
  Please only return what is asked for nothing else.
  If the name is of a famous person, please correct the spelling.
  {query}
  """
  
def get_matching_titles(names, titles):
  
  return f"""
  You are expert in pattern matching. 
  Given names of speakers and titles of podcast episodes, you need to find the titles that match the names.
  Return the list of titles that match the names and nothing else.
  If no titles match, return an empty list.
  Please only return what is asked and in a format that can be read by python code to create a list.

  Names : {names}
  Titles: {titles}

  """

def get_prompt(context, input):
  return f"""
    You have access to the podcast transcripts in the context and can use the information to answer questions. 
    You also need to search for the information across multiple podcast episodes.
    Also mention the speaker's name when providing the answer. 

    <context>
    {context}
    </context>
    
    Question: {input}
    """


def get_information_prompt():
    return """
    You have access to the podcast transcripts in the context and can use the information to answer questions. 
    You also need to search for the information across multiple podcast episodes.
    Also mention the speaker's name when providing the answer. 

    <context>
    {context}
    </context>

    Question: {input}"""