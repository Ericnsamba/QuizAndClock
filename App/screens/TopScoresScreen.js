/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
	Text,
	View,
	StyleSheet,
	Platform,
	ImageBackground,
	Dimensions,
	ScrollView,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import * as firebase from 'react-native-firebase';
import * as Theme from '../theme/Theme';
import { LeaderBoardUsers } from '../components/LeaderBoardUsers';
import FeatherIcon from 'react-native-vector-icons/Feather';

const avatar = require('../assets/images/profileAvatar.jpg');

//Redux
import { connect } from 'react-redux';
import {
	// watchUsersData
	watchPointsData,
	watchLeaderBoardData,
} from '../redux/AppRedux';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const mapStateToProps = state => {
	return {
		pointsData: state.pointsData,
		personData: state.personData,
		leaderBoardData: state.leaderBoardData,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		watchLeaderBoardData: () => {
			dispatch(watchLeaderBoardData());
		},
		watchPointsData: () => {
			dispatch(watchPointsData());
		},
	};
};
class TopScoresScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {},
			visible: false,
			userData: [],
			top3Users: [],
		};

		this.props.watchLeaderBoardData();
	}

	componentDidMount() {
		let rankUsers;
		let currentUser = firebase.auth().currentUser;
	}

	renderLeaderBoardUsers = RankingData => {
		if (RankingData && RankingData.length) {
			return RankingData.map((rank, index) => {
				if (!rank.totalPoints) {
				}
				return (
					<View
						key={rank.uid}
						style={{
							justifyContent: 'center',
							flex: 1,
							alignItems: 'center',
						}}>
						<LeaderBoardUsers
							// image={rank.image}
							rankNumber={index + 4}
							username={rank.username}
							totalPoints={rank.totalPoints}
							time={rank.timeStamp}
						/>
					</View>
				);
			});
		}
	};

	getData = () => {
		const { data } = this.state;
		let userRankings;
		firebase
			.database()
			.ref('/scores')
			.on('value', snapshot => {
				const firebaseData = snapshot.val();
				userRankings = firebaseData;
				this.setState({ data: firebaseData });
			});

		console.log(' -> getData -> userRankings', userRankings);
		return userRankings;
	};

	renderTop3 = RankingData => {
		const top3 = [];
		let user;
		if (!top3.length && RankingData.length) {
			for (let i = 0; i < 3; i++) {
				top3.push(RankingData.shift());
			}

			if (top3.length) {
				user = top3;
				console.log('TopScoresScreen -> top3', top3);
				return (
					<View
						style={{
							width: width,
							justifyContent: 'space-evenly',
							alignItems: 'center',
							flex: 1,
							flexDirection: 'row',
						}}>
						<View style={styles.topUserInfoView}>
							<View style={styles.imageBackgroundSmall}>
								<ImageBackground
									style={styles.avatarImage}
									source={require('../assets/images/profileAvatar.jpg')}
								/>
							</View>
							<View style={styles.rankNumberContainer}>
								<Text style={styles.rankingNumber}> 2 </Text>
							</View>
							<View>
								<Text
									style={{
										fontSize: 12,
										textAlign: 'center',
										color: Theme.primaryColors.blue,
									}}>
									{user[2].username}
								</Text>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'center',
										minWidth: 30,
										backgroundColor:
											Theme.primaryColors.pink,
										padding: 5,
										borderRadius: 16,
										marginTop: 3,
										alignItems: 'center',
									}}>
									<Text
										style={{
											fontSize: 14,
											textAlign: 'center',
											fontWeight: Theme.fontWeight.medium,
											color: Theme.primaryColors.white,
											paddingBottom: 2,
										}}>
										{user[2].totalPoints} pts
									</Text>
								</View>
							</View>
						</View>

						<View>
							<View
								style={{
									width: 104,
									height: 104,
									backgroundColor: 'tomato',
									borderRadius: 105 / 2,
									overflow: 'hidden',
									borderColor: Theme.primaryColors.blue,
									borderWidth: 2,
								}}>
								<ImageBackground
									style={{
										width: 105,
										height: 105,
										backgroundColor: 'tomato',
										borderRadius: 30,
									}}
									source={require('../assets/images/profileAvatar.jpg')}
								/>
							</View>
							<View
								style={{
									width: 24,
									height: 24,
									backgroundColor: Theme.primaryColors.blue,
									alignSelf: 'center',
									textAlign: 'center',
									top: -10,
									borderRadius: 3,
								}}>
								<Text
									style={{
										fontSize: 18,
										textAlign: 'center',
										color: Theme.primaryColors.white,
									}}>
									1
								</Text>
							</View>
							<View>
								<Text
									style={{
										fontSize: 18,
										textAlign: 'center',
										color: Theme.primaryColors.blue,
									}}>
									{' '}
									{user[0].username}
								</Text>
							</View>
						</View>

						<View style={styles.topUserInfoView}>
							<View
								style={{
									width: 60,
									height: 60,
									backgroundColor: 'tomato',
									borderRadius: 30,
									overflow: 'hidden',
									borderColor: Theme.primaryColors.blue,
									borderWidth: 2,
								}}>
								<ImageBackground
									style={{
										width: 60,
										height: 60,
										backgroundColor: 'tomato',
										borderRadius: 30,
									}}
									source={require('../assets/images/profileAvatar.jpg')}
								/>
							</View>
							<View
								style={{
									width: 24,
									height: 24,
									backgroundColor: Theme.primaryColors.blue,
									alignSelf: 'center',
									textAlign: 'center',
									top: -10,
									borderRadius: 3,
								}}>
								<Text
									style={{
										fontSize: 18,
										textAlign: 'center',
										color: Theme.primaryColors.white,
									}}>
									2
								</Text>
							</View>
							<View>
								<Text
									style={{
										fontSize: 12,
										textAlign: 'center',
										color: Theme.primaryColors.blue,
									}}>
									{user[2].username}
								</Text>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'center',
										minWidth: 30,
										backgroundColor:
											Theme.primaryColors.pink,
										padding: 5,
										borderRadius: 16,
										marginTop: 3,
										alignItems: 'center',
									}}>
									<Text
										style={{
											fontSize: 14,
											textAlign: 'center',
											fontWeight: Theme.fontWeight.medium,
											color: Theme.primaryColors.white,
											paddingBottom: 2,
										}}>
										{user[2].totalPoints} pts
									</Text>
								</View>
							</View>
						</View>
					</View>
				);
			}
		}
	};

	render() {
		// const RankingData = this.props.leaderBoardData;
		const RankingData = this.props.leaderBoardData
			? this.props.leaderBoardData
			: [];
		// if (RankingData) {
		return (
			<SafeAreaView
				style={{ flex: 1, backgroundColor: Theme.primaryColors.white }}>
				<View style={styles.container}>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
						}}>
						{/* <Text style={{ textAlign: 'center', fontSize: 24, top: 20 }}>Top 3 HighScore</Text> */}
						{this.renderTop3(RankingData)}
					</View>

					<View
						style={{
							flex: 2,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: Theme.primaryColors.blue,
							bottom: -40,
							borderTopLeftRadius: 30,
							borderTopRightRadius: 30,
						}}>
						<ScrollView
							showsVerticalScrollIndicator={false}
							style={{
								// bottom: -10,
								width: width - 40,
								marginTop: 30,
								marginBottom: 5,
							}}>
							{this.renderLeaderBoardUsers(RankingData)}
						</ScrollView>
					</View>
				</View>
			</SafeAreaView>
		);
		// }
	}
}

const IMAGE_SIZE = 200;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.primaryColors.white,
		height: height,
	},
	box: {
		width: IMAGE_SIZE,
		height: IMAGE_SIZE,
	},
	panelContainer: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	panelScrollView: {
		// position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	panel: {
		padding: 20,
		backgroundColor: '#fff',
		// backgroundColor: '#f7f5eee8',
	},
	header: {
		backgroundColor: '#fff',
		// backgroundColor: '#f7f5eee8',
		shadowColor: '#000000',
		paddingTop: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	panelHeader: {
		alignItems: 'center',
	},
	panelHandle: {
		width: 60,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#00000040',
		marginBottom: 10,
	},
	panelTitle: {
		fontSize: 27,
		height: 35,
	},
	panelSubtitle: {
		fontSize: 14,
		color: 'gray',
		height: 30,
		marginBottom: 10,
	},
	panelButton: {
		padding: 20,
		borderRadius: 10,
		backgroundColor: '#318bfb',
		alignItems: 'center',
		marginVertical: 10,
	},
	panelButtonTitle: {
		fontSize: 17,
		fontWeight: 'bold',
		color: 'white',
	},
	photo: {
		width: '100%',
		height: 225,
		marginTop: 30,
	},
	map: {
		height: '100%',
		width: '100%',
	},
	imageBackgroundSmall: {
		width: 60,
		height: 60,
		borderRadius: 30,
		overflow: 'hidden',
		borderColor: Theme.primaryColors.blue,
		borderWidth: 2,
	},
	avatarImage: {
		width: 60,
		height: 60,
		backgroundColor: Theme.primaryColors.blue,
		borderRadius: 30,
	},
	rankNumberContainer: {
		width: 24,
		height: 24,
		backgroundColor: Theme.primaryColors.blue,
		alignSelf: 'center',
		alignItems: 'center',
		// top: -10,
		borderRadius: 3,
	},
	rankingNumber: {
		fontSize: 18,
		textAlign: 'center',
		width: 24,
		color: Theme.primaryColors.white,
	},
	topUserInfoView: {
		justifyContent: 'center',
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(TopScoresScreen);
