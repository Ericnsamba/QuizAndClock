/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
	View,
	StyleSheet,
	StatusBar,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Platform,
	ImageBackground,
	Dimensions,
} from 'react-native';
import { Button, ButtonContainer } from '../components/QuizButton';
import { Alert } from '../components/Alert';
import { ScrollView } from 'react-native-gesture-handler';
import TouchableScale from 'react-native-touchable-scale';
import Score from '../components/Score';
import * as Theme from '../theme/Theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { SharedElement } from 'react-navigation-shared-element';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
class Quiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: this.props.route.params.name,
			correctCount: 0,
			inCorrectCount: 0,
			totalCount: Object.keys(this.props.route.params.arrayData).length,
			activeQuestionIndex: 0,
			answered: false,
			answerCorrect: false,
			answerIncorrect: false,
			modalVisible: false,
			setModalVisible: false,
			quizCategory: this.props.route.params.arrayData[0].category,
			quizImage: this.props.route.params.arrayData[0].image,
			timer: 10,
			quizQuestions: this.props.route.params.arrayData.sort((a, b) => {
				return Math.round(Math.random()) - Math.round(Math.random());
			}),
		};
	}

	componentDidMount() {
		if (this.state.timer > 1) {
			this.interval = setInterval(() => {
				// console.log({ timer: this.state.timer });
				return this.setState(prevState => ({
					timer: prevState.timer - 1,
				}));
			}, 1000);
		}
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	renderTimer = () => {
		if (!this.state.answered) {
			return this.answer(false);
		}
	};

	answer = correct => {
		this.setState(
			state => {
				const nextState = { answered: true };

				if (correct) {
					nextState.correctCount = state.correctCount + 1;
					nextState.answerCorrect = true;
				} else {
					nextState.inCorrectCount = state.inCorrectCount + 1;
					nextState.answerCorrect = false;
				}
				return nextState;
			},
			() => {
				setTimeout(() => this.nextQuestion(), 750);
			},
		);
	};

	nextQuestion = () => {
		this.setState(state => {
			const nextIndex = state.activeQuestionIndex + 1;
			if (nextIndex >= state.totalCount) {
				clearInterval(this.interval);
				return this.renderModal();
			}
			return {
				activeQuestionIndex: nextIndex,
				answered: false,
				timer: 10,
			};
		});
	};

	renderCountTracker() {
		const correctCount = this.state.correctCount;
		const inCorrectCount = this.state.inCorrectCount;
		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					width: 130,
					alignSelf: 'center',
					alignItems: 'center',
				}}>
				<View style={styles.answerCount}>
					<Icon
						name="ios-heart"
						size={24}
						color={Theme.primaryColors.blue}
					/>
					<Text
						style={{
							fontSize: 18,
							color: Theme.primaryColors.blue,
						}}>
						{' '}
						{correctCount}
					</Text>
				</View>
				<View style={[styles.answerCount, { backgroundColor: Theme.secondaryColors.pink}]}>
					<Icon
						name="ios-close-circle"
						size={24}
						color={Theme.primaryColors.pink}
						style={{ paddingTop: 2 }}
					/>
					<Text
						style={{
							fontSize: 18,
							color: Theme.primaryColors.pink,
						}}>
						{' '}
						{inCorrectCount}
					</Text>
				</View>
			</View>
		);
	}

	hideModal = () => {
		this.setState(
			{
				setModalVisible: false,
				modalVisible: false,
			},
			() => this.props.navigation.navigate('QuizIndex'),
		);
	};

	renderModal() {
		if (
			this.state.correctCount + this.state.inCorrectCount ===
			this.state.totalCount
		) {
			return {
				setModalVisible: true,
				modalVisible: true,
			};
		}
	}

	render() {
		const currentQuestion = this.state.quizQuestions[
			this.state.activeQuestionIndex
		];

		let { timer } = this.state;

		return (
      <View style={[styles.container]}>
        <StatusBar barStyle="dark-content" />
        <ImageBackground
          source={require('../assets/images/app-bg.jpg')}
          style={{flex: 1, width: '100%', height: '100%'}}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>
              Question{' '}
              {`${this.state.activeQuestionIndex + 1}/${
                this.state.totalCount
              }`}
            </Text>
            <View style={styles.timer}>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: Theme.secondaryColors.blue,
                  },
                ]}>
                {timer === 0 ? (
                  this.renderTimer()
                ) : (
                  <Text>{this.state.timer}</Text>
                )}
              </Text>
            </View>
          </View>
          <View style={styles.footer}>
            <View style={styles.questionView}>
              <SharedElement id={`${currentQuestion.category}`}>
                <Text style={styles.question}>
                  {currentQuestion.question}
                </Text>
              </SharedElement>
            </View>

            <ScrollView>
              <View
                style={{
                  width: width - 60,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <ButtonContainer>
                  {currentQuestion.answers.map((answer, index) => (
                    <Button
                      key={index}
                      answerNum={index + 1}
                      text={answer.text}
                      onPress={() => this.answer(answer.correct)}
                      correct={this.state.answerCorrect}
                      visible={this.state.answered}
                    />
                  ))}
                </ButtonContainer>
              </View>
            </ScrollView>

            <View style={styles.quizFooter}>
              <TouchableScale
                style={styles.card}
                onPress={() => this.props.navigation.goBack()}
                activeScale={0.7}>
                <LinearGradient
                  colors={['#4569e1', Theme.primaryColors.blue]}
                  style={[styles.closeButton]}>
                  <Icon
                    name="ios-close"
                    size={30}
                    color={Theme.primaryColors.white}
                    style={styles.closeIcon}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Theme.primaryColors.white,
                      fontSize: 18,
                      paddingBottom: 3,
                      fontWeight: Theme.fontWeight.medium,
                    }}>
                    Quit
                  </Text>
                </LinearGradient>
              </TouchableScale>

              {this.renderCountTracker()}
            </View>
            <Score parentState={this.state} hideModal={this.hideModal} />
          </View>
        </ImageBackground>
        <Alert
          correct={this.state.answerCorrect}
          visible={this.state.answered}
        />
      </View>
    );
	}
}


Quiz.sharedElements = route => {
  const {item} = route.params;
  console.log("🚀 ~ file: Quiz.js ~ line 290 ~ item", item);
  return [
    {
      id: `item.${item.id}.photo`,
      animation: 'move',
      resize: 'clip',
    },
    // {
    //   id: `item.${item.id}.title`,
    //   animation: 'fade',
    //   resize: 'clip',
    // },
    // {
    //   id: `item.${item.id}.description`,
    //   animation: 'fade',
    //   resize: 'clip',
    // },
    // {
    //   id: `item.${item.id}.iconName`,
    //   animation: 'move',
    //   resize: 'clip',
    // },
  ];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
  },
  headerContainer: {
    top: 30,
    width: width,
    height: 124,
    marginBottom: 24,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.primaryColors.white,
    alignSelf: 'center',
  },
  timer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: Theme.primaryColors.blue,
    justifyContent: 'center',
    alignSelf: 'center',
    color: Theme.secondaryColors.white,
  },
  questionView: {
    minHeight: 200,
    width: width - 50,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Theme.primaryColors.blue,
    borderRadius: 20,
    padding: 10,
    shadowColor: Theme.primaryColors.blue,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  question: {
    color: Theme.primaryColors.white,
    fontSize: 24,
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    letterSpacing: -0.02,
    fontWeight: '500',
  },
  renderCountTracker: {
    width: width - 60,
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 40,
    // position: 'relative',
    alignSelf: 'center',
    flex: 1,
    position: 'absolute',
  },
  answerCount: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    height: 40,
    width: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.secondaryColors.blue,
  },
  closeButton: {
    width: 100,
    height: 50,
    borderRadius: 12,
    backgroundColor: Theme.secondaryColors.blue,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 6,
    zIndex: 9,
    borderColor: Theme.secondaryColors.blue,
    borderWidth: 2,
  },
  closeIcon: {
    // paddingRight: 5,
  },

  quizFooter: {
    width: width - 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 0,
    position: 'relative',
    alignSelf: 'center',
  },

  bgImage: {
    width: width,
    position: 'absolute',
    bottom: -130,
    opacity: 0.5,
  },
  safearea: {
    flex: 1,
    height: height,
    justifyContent: 'space-between',
  },
  footer: {
    flex: Platform.OS === 'ios' ? 5 : 5,
    backgroundColor: Theme.primaryColors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
});

export default Quiz;
