/* eslint-disable react-native/no-inline-styles */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, Component } from 'react';
import firebase from 'react-native-firebase';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	SafeAreaView,
	Dimensions,
	Button
} from "react-native";
import { connect } from 'react-redux';
import { watchPersonData, watchPointsData, watchUsersData } from '../redux/AppRedux';
import * as Theme from '../theme/Theme';
import ScoreHeader from '../components/ScoreHeader';
import { ScoresInCategory } from '../components/ScoresInCategory.js';
import { ScrollView } from 'react-native-gesture-handler';
import { Themed } from 'react-navigation';

const { width, height } = Dimensions.get('window');

const mapStateToProps = state => {
	return {
		pointsData: state.pointsData,
		personData: state.personData,
		usersData: state.usersData,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		watchPersonData: () => {
			dispatch(watchPersonData());
		},
		watchPointsData: () => {
			dispatch(watchPointsData());
		},
		watchUsersData: () => {
			dispatch(watchUsersData());
		},
	};
};



class ProfileScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isAnonymous: firebase.auth().currentUser._user.isAnonymous,
			user: {}
		};
		this.props.watchPointsData();
		this.props.watchPersonData();
	}

	renderScoresInCategory = (pointsData) => {
		const userPoints = this.props.pointsData;
		if (userPoints) {
			const scoreInfo = Object.keys(userPoints).map(key => {
				const obj = userPoints[key]
				return (
					<View key={key}>
						<ScoresInCategory
							image={obj.image}
							key={key}
							name={key}
							time={obj.timeStamp}
							points={obj.points}
						// onPress={() =>
						// 	this.props.navigation.navigate('Quiz', {
						// 		arrayData,
						// 	})
						// }
						/>
					</View>
				);
			})
			return scoreInfo
		}
	}

	Item = ({ name }) => {
		return (
			<View style={styles.item}>
				<Text style={styles.name}>{name}</Text>
			</View>
		);
	}
	render() {
		const { isAnonymous } = this.state;
		// console.log("render -> isAnonymous", this.props)

		const pointsData = this.props.pointsData;
		return (
			<View style={styles.container}>
				<View style={{ marginTop: 64, alignItems: "center" }}>
					<View style={styles.avatarContainer}>
						<Image
							source={
								this.state.user.avatar
									// ? { uri: this.state.user.avatar }
									? require("../assets/images/profileAvatar.jpg")
									: require("../assets/images/profileAvatar.jpg")
							}
							style={styles.avatar}
						/>
					</View>
					{/* <Text style={styles.name}>{this.state.user.name}</Text> */}
				</View>
				<View style={styles.statsContainer}>
					<View style={styles.stat}>
						<Text style={styles.statAmount}>21</Text>
						<Text style={styles.statTitle}>Posts</Text>
					</View>
					<View style={styles.stat}>
						<Text style={styles.statAmount}>981</Text>
						<Text style={styles.statTitle}>Followers</Text>
					</View>
					<View style={styles.stat}>
						<Text style={styles.statAmount}>63</Text>
						<Text style={styles.statTitle}>Following</Text>
					</View>
				</View>

				<View >
					<View style={{ width: width - 60, justifyContent: 'center', alignSelf: 'center', marginTop: 40 }}>
						<Text style={{ textAlign: 'left', fontSize: 20, color: Theme.primaryColors.blue, fontWeight: 'bold', }}>Your Scores</Text>
					</View>

					<ScrollView>
						<View>
							{this.renderScoresInCategory(pointsData)}
						</View>
					</ScrollView>
				</View>

				<View style={{
					position: 'absolute',
					bottom: 20,
					padding: 10,
					backgroundColor: Theme.primaryColors.blue,
					width: 100,
					alignItems: 'center',
					alignSelf: 'center',
					borderRadius: 30,
				}}>
					<TouchableOpacity onPress={() => firebase.auth().signOut()}>
						<Text
							style={{
								color: Theme.primaryColors.white,
								textTransform: 'uppercase',
								fontWeight: '500',
								fontSize: 12,
							}}>Logout</Text>
					</TouchableOpacity>

				</View>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	profile: {
		marginTop: 64,
		alignItems: "center"
	},
	avatarContainer: {
		shadowColor: "#151734",
		shadowRadius: 30,
		shadowOpacity: 0.4
	},
	avatar: {
		width: 136,
		height: 136,
		borderRadius: 68
	},
	name: {
		marginTop: 24,
		fontSize: 16,
		fontWeight: "600"
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		margin: 32
	},
	stat: {
		alignItems: "center",
		flex: 1
	},
	statAmount: {
		color: Theme.primaryColors.blue,
		fontSize: 18,
		fontWeight: "300"
	},
	statTitle: {
		color: "#C3C5CD",
		fontSize: 12,
		fontWeight: "500",
		marginTop: 4
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ProfileScreen);