import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Card } from "react-native-elements";

const Contact = () => {
  return (
    <View style={{ flex: 1, justifyContent: "flex-start", marginVertical: 1 }}>
      <Card title="Our Address">
        <View>
          <Text style={{ margin: 3 }}>121, Clear Water Bay Road</Text>
          <Text style={{ margin: 3 }}>Clear Water Bay, Kowloon</Text>
          <Text style={{ margin: 2 }}>HONG KONG Tel:</Text>
          <Text style={{ margin: 3 }}>Tel: +852 1234 5678</Text>
          <Text style={{ margin: 2 }}> Fax: +852 8765 4321</Text>
          <Text style={{ margin: 1 }}>Email:confusion@food.net</Text>
        </View>
      </Card>
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({});
