// Put your code below this line.
// https://docs.amplify.aws/javascript/build-a-backend/storage/storage-v5-to-v6-migration-guide/ REFER TO THIS FOR AWS AMPLIFY FUNCTIONS
import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";
import { generateClient, get, put } from 'aws-amplify/api';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';

const client = generateClient();

const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    getRestData();
  }, []);
  

  // this function connects to the REST api, and retrieves all data from the api
  async function getRestData() {
    try {
      const restOperation = get({ 
        apiName: 'cofwplatapi',
        path: '/embeddings' 
      });
      const response = await restOperation.response;
      console.log('GET call succeeded: ', response);
    } catch (e) {
      console.log('GET call failed: ', JSON.parse(e.response.body));
    }
  }
  
  // this function updates data to the REST api and the dynamodb database
  async function updateRestData() {
    try {
      const info = { name: 'My first todo', content: 'Hello world!' };
      const restOperation = put({
        apiName: 'cofwplatapi',
        path: '/embeddings/1',
        options: {
          body: info
        }
      });
      const response = await restOperation.response;
      console.log('PUT call succeeded: ', response);
    } catch (e) {
      console.log('PUT call failed: ', JSON.parse(e.response.body));
    }
  }


  // funtion to fetchNotes to fetch an image if there is an image associated with a note
  async function fetchNotes() {
    const apiData = await client.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await getUrl(note.name);
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  // createNote function add the image to the local image array if an image is associated with the note
  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      //description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await uploadData(data.name, image);
    await client.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }
  

  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await remove(name);
    await client.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <View className="App">
      <Heading level={1}>COFW AI Plat Analyzer</Heading>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          
          <Button type="submit" variation="primary">
            Create Note
          </Button>
          <View
            name="image"
            as="input"
            type="file"
            style={{ alignSelf: "end" }}
            />
        </Flex>
      </View>
      <Heading level={2}>Current Notes</Heading>
      <View margin="3rem 0">
      {notes.map((note) => (
        <Flex
            key={note.id || note.name}
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <Text as="strong" fontWeight={700}>
            {note.name}
            </Text>
            
            {note.image && (
            <Image
                src={note.image}
                alt={`visual aid for ${notes.name}`}
                style={{ width: 400 }}
            />
            )}
            <Button variation="link" onClick={() => deleteNote(note)}>
            Delete note
            </Button>
        </Flex>
        ))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
      <Button onClick={getRestData}>Get REST API data</Button>
      <Button onClick={updateRestData}>Post REST API data</Button>
    </View>
  );
};

export default withAuthenticator(App);