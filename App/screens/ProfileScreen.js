/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, { useEffect, Component } from 'react';
import firebase from 'react-native-firebase';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	SafeAreaView,
	StatusBar,
	Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {
	watchPersonData,
	watchPointsData,
	watchUsersData,
	watchLeaderBoardData
} from '../redux/AppRedux';
import * as Theme from '../theme/Theme';
import { ScoresInCategory } from '../components/ScoresInCategory.js';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const mapStateToProps = state => {
	return {
		pointsData: state.pointsData,
		personData: state.personData,
		usersData: state.usersData,
		leaderBoardData: state.leaderBoardData,
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
		watchLeaderBoardData: () => {
			dispatch(watchLeaderBoardData());
		},
	};
};

class ProfileScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isAnonymous: firebase.auth().currentUser._user.isAnonymous,
			user: {},
			Categories: 0,
		};
		this.props.watchPointsData();
		this.props.watchPersonData();
		this.props.watchLeaderBoardData();
	}

	renderScoresInCategory = pointsData => {
		const userPoints = this.props.pointsData;
		if (userPoints) {
			const scoreInfo = Object.keys(userPoints).map(key => {
				const obj = userPoints[key];
				return (
					<View key={key} style={styles.ScoresInCategory}>
						<ScoresInCategory
							image={obj.image}
							key={key}
							name={key}
							time={obj.timeStamp}
							points={obj.points}
						/>
					</View>
				);
			});
			return scoreInfo;
		}
	};

	renderPoints = () => {
		let points = 0;
		const currentUser = firebase.auth().currentUser;
		const quizPlayed = this.props.pointsData;

		if (currentUser && quizPlayed) {
			Object.values(quizPlayed).map(game => (points += game.points));
		} else if (!currentUser) {
			return (points = '');
		}
		return points;
	};

	renderCategoryCount = () => {
		let Categories = 0;
		const currentUser = firebase.auth().currentUser;
		const quizPlayed = this.props.pointsData;
		if (currentUser && quizPlayed) {
			const obj = Object.keys(quizPlayed).length;
			Categories = obj;
		}
		return Categories;
	};

	render() {
		const userID = firebase.auth().currentUser.uid;
		console.log('leaderBoardData======>', this.props.leaderBoardData);
		console.log('leaderBoardData======>', this.props.leaderBoardData.map(rank => rank.uid));

		const userRanking = this.props.leaderBoardData.map(rank => rank.uid).indexOf(userID);
		console.log("ProfileScreen -> render -> userRanking", userRanking)

		const { isAnonymous } = this.state;
		const pointsData = this.props.pointsData;
		const { username, email, profileImage } = this.props.personData;
		const avatar = require('../assets/images/profileAvatar.jpg');
		return (
			<View style={styles.container}>
				<StatusBar isVisible barStyle="dark-content" />
				<View style={{ marginTop: 64, alignItems: 'center' }}>
					<View style={styles.avatarContainer}>
						<Image
							resizeMode={'cover'}
							source={profileImage ? { uri: profileImage } : avatar}
							style={styles.avatar}
						/>
					</View>
					<View style={styles.userNameView}>
						<Text style={styles.userName}>{username}</Text>
						<Text style={styles._email}>{email}</Text>
					</View>
				</View>
				<View style={styles.statsContainer}>
					<View style={styles.stat}>
						<Text style={styles.statAmount}>{this.renderPoints()}</Text>
						<Text style={styles.statTitle}>Points</Text>
					</View>
					<View style={styles.stat}>
						<Text style={styles.statAmount}>{this.renderCategoryCount()}</Text>
						<Text style={styles.statTitle}>Categories</Text>
					</View>
					<View style={styles.stat}>
						<Text style={styles.statAmount}>{userRanking + 1}</Text>
						<Text style={styles.statTitle}>Rank</Text>
					</View>
				</View>

				<LinearGradient
					colors={[Theme.primaryColors.orange, Theme.primaryColors.orange2, Theme.primaryColors.white]}
					style={styles.innerContainer}>
					<View>
						<View
							style={{
								width: width - 60,
								justifyContent: 'center',
								alignSelf: 'center',
								marginTop: 40,
							}}>
							<Text
								style={{
									textAlign: 'left',
									fontSize: 20,
									color: Theme.primaryColors.white,
									fontWeight: 'bold',
									marginBottom: 20,
								}}>
								Quizzes Played
							</Text>
						</View>

						<ScrollView
							contentOffset={{ x: -20, y: 0 }}
							bouncesZoom={true}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							style={styles.scrollView}>
							{this.renderScoresInCategory(pointsData)}
						</ScrollView>
					</View>

					<View
						style={{
							position: 'absolute',
							bottom: 20,
							padding: 10,
							backgroundColor: Theme.primaryColors.blue,
							width: 100,
							alignItems: 'center',
							alignSelf: 'center',
							borderRadius: 30,
						}}>
						<TouchableOpacity
							onPress={() => firebase.auth().signOut()}>
							<Text
								style={{
									color: Theme.primaryColors.white,
									textTransform: 'uppercase',
									fontWeight: '500',
									fontSize: 12,
								}}>
								Logout
							</Text>
						</TouchableOpacity>
					</View>
				</LinearGradient>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	innerContainer: {
		flex: 1,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		backgroundColor: Theme.primaryColors.blue,
	},
	profile: {
		alignItems: 'center',
	},
	scrollView: {
		marginLeft: 1,
	},
	avatarContainer: {
		borderColor: Theme.primaryColors.blue,
		borderWidth: 2,
		borderRadius: 30,
		overflow: 'hidden',
	},
	avatar: {
		width: 116,
		height: 116,
		// borderRadius: 30,
		// backgroundColor: Theme.secondaryColors.blue,
	},
	name: {
		marginTop: 24,
		fontSize: 16,
		fontWeight: '600',
	},
	userNameView: {
		marginVertical: 20,
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		width: width - 60,

	},
	userName: {
		fontSize: 20,
		fontWeight: '800',
		marginBottom: 5,
		color: Theme.primaryColors.blue,
	},
	_email: {
		fontSize: 14,
		color: '#939393',
	},
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 12,
	},
	stat: {
		alignItems: 'center',
		flex: 1,
	},
	statAmount: {
		color: Theme.primaryColors.blue,
		fontSize: 18,
		fontWeight: '300',
	},
	statTitle: {
		color: Theme.primaryColors.black,
		fontSize: 12,
		fontWeight: Theme.fontWeight.medium,
		marginTop: 4,
	},
	ScoresInCategory: {
		marginHorizontal: 10,
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ProfileScreen);
