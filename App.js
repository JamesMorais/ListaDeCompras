import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const [listCompras, setListCompras] = useState([]);
  const [productName, setProductName] = useState(''); 
  const [quantity, setQuantity] = useState(''); 

  async function addNew() {
    if (productName !== "" && quantity !== "") {
      const db = await SQLite.openDatabaseAsync('databaseApp');

      await db.runAsync(
        'INSERT INTO products (value, intValue) VALUES (?, ?)',
        [productName, parseInt(quantity)]
      );

      const allRows = await db.getAllAsync('SELECT * FROM products');
      let newArray = [];
      for (const row of allRows) {
        console.log(row.id, row.value, row.intValue);
        newArray.push({ id: row.id, value: row.value, intValue: row.intValue });
      }
      setListCompras(newArray);
      setProductName(''); 
      setQuantity(''); 
    }
  };

  async function deleteItem(id) {
    const db = await SQLite.openDatabaseAsync('databaseApp');

    await db.runAsync('DELETE FROM products WHERE id = ?', [id]);

    const allRows = await db.getAllAsync('SELECT * FROM products');
    let newArray = [];
    for (const row of allRows) {
      console.log(row.id, row.value, row.intValue);
      newArray.push({ id: row.id, value: row.value, intValue: row.intValue });
    }
    setListCompras(newArray);
  }

  useEffect(() => {
    async function setup() {
      const db = await SQLite.openDatabaseAsync('databaseApp');

      const allRows = await db.getAllAsync('SELECT * FROM products');
      let newArray = [];
      for (const row of allRows) {
        console.log(row.id, row.value, row.intValue);
        newArray.push({ id: row.id, value: row.value, intValue: row.intValue });
      }
      setListCompras(newArray);
    }
    setup();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={productName}
        onChangeText={setProductName} 
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity} 
      />
      <Button title="Adicionar Itém" onPress={addNew} />
      {listCompras.map((item, index) => {
        return (
          <View key={index} style={styles.itemContainer}>
            <Text>{item.value} - {item.intValue}</Text>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
