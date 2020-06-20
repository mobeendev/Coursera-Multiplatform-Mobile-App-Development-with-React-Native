import React, { Component, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Modal,
  StyleSheet,
  Button,
} from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
import { postFavorite } from "../redux/ActionCreators";

import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
});

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
        <Text style={{ fontSize: 12 }}>
          {"-- " + item.author + ", " + item.date}{" "}
        </Text>
      </View>
    );
  };

  return (
    <Card title="Comments">
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </Card>
  );
}

function RenderDish(props) {
  const dish = props.dish;

  if (dish != null) {
    return (
      <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
        <Text style={{ margin: 10 }}>{dish.description}</Text>
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
        >
          <Icon
            raised
            reverse
            name={props.favorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#f50"
            onPress={() =>
              props.favorite ? console.log("Already favorite") : props.onPress()
            }
          />
          <Icon
            raised
            reverse
            name={"pencil"}
            type="font-awesome"
            color="#512DA8"
            onPress={() => props.openModal()}
          />
        </View>
      </Card>
    );
  } else {
    return <View></View>;
  }
}

class DishDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      showModal: false,
      rating: "",
      author: "",
      comment: "",
    };
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  handleComment(dishId) {
    console.log(JSON.stringify(this.state));
    this.toggleModal();
  }

  static navigationOptions = {
    title: "Dish Details",
  };

  render() {
    const dishId = this.props.navigation.getParam("dishId", "");
    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some((el) => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          openModal={() => this.toggleModal()}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            (comment) => comment.dishId === dishId
          )}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => {
            this.toggleModal();
          }}
          onRequestClose={() => {
            this.toggleModal();
          }}
        >
          <View style={styles.modal}>
            <View>
              <Rating
                type="star"
                fractions={0}
                startingValue={0}
                imageSize={38}
                onFinishRating={(rating) => this.setState({ rating: rating })}
                showRating
              />
            </View>
            <View style={styles.modalText}>
              <Input
                placeholder="Author"
                leftIcon={<Icon name="user-o" type="font-awesome" size={24} />}
                onChangeText={(author) => this.setState({ author })}
              />
            </View>
            <View style={styles.modalText}>
              <Input
                placeholder="Comment"
                leftIcon={
                  <Icon name="comment-o" type="font-awesome" size={24} />
                }
                onChangeText={(comment) => this.setState({ comment })}
              />
            </View>
            <View style={styles.modalText}>
              <Button
                onPress={() => {
                  this.handleComment(dishId);
                }}
                color="#512DA8"
                title="Submit"
              />
            </View>
            <View style={styles.modalText}>
              <Button
                onPress={() => {
                  this.toggleModal();
                }}
                color="#984500"
                title="Close"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  formLabel: {
    fontSize: 18,
    flex: 2,
  },
  formItem: {
    flex: 1,
  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#512DA8",
    textAlign: "center",
    color: "white",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    margin: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
