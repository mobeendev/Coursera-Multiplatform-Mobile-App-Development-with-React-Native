import React, { Component, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
  Button,
  Alert,
  PanResponder,
} from "react-native";
import { Card, Icon, AirbnbRating, Input } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postComment } from "../redux/ActionCreators";
import { postFavorite } from "../redux/ActionCreators";
import * as Animatable from "react-native-animatable";

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    addComment: state.addComment,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postComment: (comment) => dispatch(postComment(comment)),
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
      <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCommentItem}
        />
      </Animatable.View>
    </Card>
  );
}

class DishDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      showModal: false,
      rating: 1,
      dishId: 0,
      comment: "",
      author: "",
      date: "",
    };
  }

  modaltoggle() {
    this.setState({ showModal: !this.state.showModal });
  }
  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  resetform() {
    this.modaltoggle();
    var d = new Date();
    var n = d.toISOString();
    this, this.setState({ date: n });
    console.log("In dish detail activating post comment");
    this.props.postComment({
      dishId: this.state.dishId,
      rating: this.state.rating,
      comment: this.state.comment,
      author: this.state.author,
      date: this.state.date,
    });
  }

  static navigationOptions = {
    title: "Dish Details",
  };
  render() {
    const dishId = this.props.navigation.getParam("dishId", "");

    const dish = this.props.dishes.dishes[+dishId];
    const favorite = this.state.favorites.some((el) => el === dishId);

    const handleViewRef = (ref) => (this.view = ref);

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
      if (dx < -200) return true;
      else return false;
    };

    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
      if (dx > -200) return true;
      else return false;
    };

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => {
        return true;
      },
      onPanResponderGrant: () => {
        this.view
          .rubberBand(1000)
          .then((endState) =>
            console.log(endState.finished ? "Finished" : "Cancelled")
          );
      },

      onPanResponderEnd: (e, gestureState) => {
        if (recognizeDrag(gestureState))
          Alert.alert(
            "Add to favorites",
            "Are you sure you want to add " + dish.name + " to your favorites?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("canceled favorite"),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () =>
                  favorite
                    ? console.log("already favorite")
                    : this.markFavorite(dishId),
              },
            ],
            { cancelable: false }
          );
        if (recognizeComment(gestureState)) this.modaltoggle();
        return true;
      },
    });
    return (
      <ScrollView>
        <Animatable.View
          animation="fadeInDown"
          duration={2000}
          delay={1000}
          ref={handleViewRef}
          {...panResponder.panHandlers}
        >
          <Card
            featuredTitle={dish.name}
            image={{ uri: baseUrl + "/" + dish.image }}
          >
            <Text style={styles.description}>{dish.description}</Text>
            <View style={styles.iconstyle}>
              <Icon
                raised
                reverse
                name={favorite ? "heart" : "heart-o"}
                type="font-awesome"
                color="#f50"
                onPress={() =>
                  favorite
                    ? console.log("already favorite")
                    : this.markFavorite(dishId)
                }
              ></Icon>
              <Icon
                raised
                reverse
                name={"pencil"}
                type="font-awesome"
                color="#f50"
                onPress={() => {
                  this.modaltoggle();
                  this.setState({ dishId: dishId });
                }}
              ></Icon>
            </View>
          </Card>

          <View>
            <Modal
              animationType={"slide"}
              transparent={false}
              visible={this.state.showModal}
            >
              <View>
                <AirbnbRating
                  count={5}
                  reviews={[
                    "rating 1/5",
                    "rating 2/5",
                    "rating 3/5",
                    "rating 4/5",
                    "rating 5/5",
                  ]}
                  defaultRating={1}
                  size={30}
                  onFinishRating={(ratings) => {
                    this.setState({ rating: ratings });
                  }}
                ></AirbnbRating>
                <Input
                  placeholder="Author"
                  leftIcon={{ type: "font-awesome", name: "user" }}
                  onChangeText={(Author) => {
                    this.setState({ author: Author });
                  }}
                ></Input>
                <Input
                  placeholder="Comments"
                  leftIcon={{ type: "font-awesome", name: "comment-o" }}
                  onChangeText={(comments) => {
                    this.setState({ comment: comments });
                  }}
                ></Input>

                <Button
                  title="Submit"
                  color="#512DA8"
                  onPress={() => this.resetform()}
                ></Button>
                <View style={styles.Spacer}></View>
                <Button
                  style={styles.modalbutton}
                  onPress={() => this.modaltoggle()}
                  title="Close"
                  color="#512DA8"
                  width="50"
                ></Button>
              </View>
            </Modal>
          </View>
          <FlatList
            ListHeaderComponent={<></>}
            ListFooterComponent={
              <>
                <RenderComments
                  comments={this.props.comments.comments.filter(
                    (comment) => comment.dishId === this.state.dishId
                  )}
                />
              </>
            }
          ></FlatList>
        </Animatable.View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    margin: 10,
  },
  Spacer: {
    margin: 10,
  },
  iconstyle: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalbutton: {
    width: 50,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
