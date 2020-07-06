import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Card, Button, Icon } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import * as MailComposer from "expo-mail-composer";

class Contact extends React.Component {
  sendMail() {
    MailComposer.composeAsync({
      recipients: ["confusion@food.net"],
      subject: "Enquiry",
      body: "To whom it may concern:",
    });
  }

  render() {
    return (
      <View
        style={{ flex: 1, justifyContent: "flex-start", marginVertical: 1 }}
      >
        <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
          <Card title="Our Address">
            <View>
              <Text style={{ margin: 3 }}>121, Clear Water Bay Road</Text>
              <Text style={{ margin: 3 }}>Clear Water Bay, Kowloon</Text>
              <Text style={{ margin: 2 }}>HONG KONG Tel:</Text>
              <Text style={{ margin: 3 }}>Tel: +852 1234 5678</Text>
              <Text style={{ margin: 2 }}> Fax: +852 8765 4321</Text>
              <Text style={{ margin: 1 }}>Email:confusion@food.net</Text>
            </View>
            <Button
              title="Send Email"
              buttonStyle={{ backgroundColor: "#512DA8" }}
              icon={
                <Icon name="envelope-o" type="font-awesome" color="white" />
              }
              onPress={this.sendMail}
            />
          </Card>
        </Animatable.View>
      </View>
    );
  }
}

export default Contact;

const styles = StyleSheet.create({});
