import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import config from './src/aws-exports';
import { createTodo } from './src/graphql/mutations';
import { listTodos } from './src/graphql/queries';

Amplify.configure(config);

export default function App() {
  const [name, setName] = useState("");
  const [todos, setTodos] = useState([]);  

  useEffect(() => {
	const getTodos = async () => {
		try {
			const todosResult = await API.graphql(graphqlOperation(listTodos));
			console.log("Todos: ", todosResult);
			setTodos(todosResult.data.listTodos.items);
		} catch (err) {
			console.log("listTodos ERROR: ", err);
		}
	};
	getTodos();
  }, []);

  const onChangeText = (key, val) => {
    setName(val);  
  }

  const addTodo = async (event) => {
	event.preventDefault();

	const input = {
		name
	}

	const result = await API.graphql(graphqlOperation(createTodo, { input }));

	const newTodo = result.data.createTodo;
	const updatedTodo = [newTodo, ...todos];
	setTodos(updatedTodo);
	setName("");
  }

  return (
    <View style={styles.container}>
      	<TextInput
		style={styles.input}
		value={name}
		onChangeText={val => onChangeText("name", val)}
		placeholder='Add a Todo'
	/>
	<TouchableOpacity onPress={addTodo} style={styles.buttonContainer}>
		<Text style={styles.buttonText}>Add +</Text>
	{todos && todos.map((todo, index) => (
        	<View key={index} style={styles.todo}>
                	<Text style={styles.name}>{todo.name}</Text>
                </View>
        ))}
	</TouchableOpacity>
	<StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 10,
		paddingTop: 50
	},
	input: {
		height: 50,
		borderBottomWidth: 2,
		borderBottomColor: "blue",
		marginVertical: 10
	},
	buttonContainer: {
		backgroundColor: "#34495e",
		marginTop: 10,
		marginBottom: 10,
		padding: 10,
		borderRadius: 5,
		alignItems: "center"
	},
	buttonText: {
		color: "#fff",
		fontSize: 24
	},
	todo: {
        	borderBottomWidth: 1,
       		borderBottomColor: "#ddd",
        	paddingVertical: 10
    	},
    	name: { fontSize: 16 }
})
