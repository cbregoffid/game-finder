import os
import numpy as np
from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

openai_client = OpenAI(api_key=OPENAI_API_KEY)
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("game-finder")

def embed_text(text):
    response = openai_client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

def get_game_vector(game_name):
    response = openai_client.embeddings.create(
        input=game_name,
        model="text-embedding-3-small"
    )
    results = index.query(vector = response.data[0].embedding, top_k=1, filter ={"name": game_name}, include_metadata=True, include_values=True)

    return results.matches[0].values

def average_vectors(vectors):
    if not vectors:
        return None
    return np.mean(vectors, axis=0).tolist()

def search(query_vector, top_k=10):
    results = index.query(vector=query_vector, top_k=top_k, include_metadata=True)
    return results.matches

def main():
    adjectives = input("Enter multiple adjectives: ").split(",")
    game_names = input("Enter multiple game names: ").split(",")
    all_vectors = []
    adjective_vector = embed_text(", ".join(adjectives))
    all_vectors.append(adjective_vector)

    for game in game_names:
        game_vector = get_game_vector(game.strip())
        if game_vector:
            all_vectors.append(game_vector)

    query_vector = average_vectors(all_vectors)
    results = search(query_vector)
    for result in results:
        print(f"Name: {result.metadata['name']}, Summary: {result.metadata['summary']}, Genres: {result.metadata['genres']}, Themes: {result.metadata['themes']}")

if __name__ == "__main__":
    main()