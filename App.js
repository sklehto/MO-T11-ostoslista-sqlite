import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglist.db');

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);

  // Create a shopping list:
  useEffect(() => {
    db.transaction(text => {
      text.executeSql('create table if not exists shoppinglist (id integer primary key not null, amount text, product text);');
    }, null, updateList);
  }, []);

  // Add products to the shopping list:
  const saveProduct = () => {
    db.transaction(text => {
      text.executeSql('insert into shoppinglist (amount, product) values (?, ?);', [amount, product]);
    }, null, updateList);
    setProduct('');
    setAmount('');
  };

  // Update the shopping list:
  const updateList = () => {
    db.transaction(text => {
      text.executeSql('select * from shoppinglist;', [], (_, { rows }) => setList(rows._array));
    }, null, null);
  };

  // Delete products from the shopping list:
  const deleteProduct = (id) => {
    db.transaction(text => {
      text.executeSql('delete from shoppinglist where id = ?;', [id]);
    }, null, updateList)
  };

  return (
    <View style={styles.container}>

      <TextInput 
        style={styles.input}
        placeholder='Product'
        onChangeText={product => setProduct(product)}
        value={product} />
      <TextInput
        style={styles.input}
        placeholder='Amount'
        keyboardType='numeric'
        onChangeText={amount => setAmount(amount)}
        value={amount} />
      <View style={styles.button}>
        <Button onPress={saveProduct} title="Save" />
      </View>

      <Text style={{fontWeight: 'bold'}}>Shopping list</Text>
      <FlatList
        data={list}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
          <View style={styles.shoppinglist}>
            <Text>{item.product}, {item.amount}</Text>
            <Text style={{color: 'blue'}} onPress={ () => deleteProduct(item.id) }> bought </Text>
          </View> }
       />
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
    marginTop: 100,
  },
  input: {
    width: 250,
    borderColor: 'grey',
    borderWidth: 1,
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    width: 100,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  shoppinglist: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});
