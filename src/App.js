import React, {useState, useEffect, Fragment} from 'react'
import StarRatings from 'react-star-ratings';
import questions from './questions.json';
import './App.css'

function App () {
    const [curQuestionIndex, setCurQuestionIndex] = useState(0);
    const [totalQuestionCnt, setTotalQuestionCnt] = useState(20);
    const [answers, setAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(0);
    const [questionResult, setQuestionResult] = useState('');
    const [score, setScore] = useState(0);
    const [maxScore, setMaxScore] = useState(100);
    const [minScore, setMinScore] = useState(0);
    const [rightAnswers, setRightAnswers] = useState(0);
    const [isFinished, setIsFinished] = useState(false);


    const setQuestionData = (questionIndex) => {
        const questionData = questions[questionIndex];
        let answers_temp = questionData.incorrect_answers;
        answers_temp.push(questionData.correct_answer);
        answers_temp.sort((a,b) => 0.5 - Math.random());
        setAnswers(answers_temp);
    };
    useEffect(() => {
        setTotalQuestionCnt(questions.length);
        setQuestionData(0);
    },[]);


    const onClickAnswer = (index) => {
        setSelectedAnswer(index);
    };

    const onNext = () => {

      const questionData = questions[curQuestionIndex];
      let updatedRightAnswers = rightAnswers;
      if(questionData.correct_answer === answers[selectedAnswer]){
          setQuestionResult('Correct!');
          updatedRightAnswers = rightAnswers + 1;
      } else setQuestionResult('Sorry!');
      setRightAnswers(updatedRightAnswers);

      const testedQuestionCnt = curQuestionIndex + 1;
      setScore((updatedRightAnswers / testedQuestionCnt * 100).toFixed(2));
      setMaxScore(((updatedRightAnswers + totalQuestionCnt - testedQuestionCnt) / totalQuestionCnt * 100).toFixed(2));
      setMinScore((updatedRightAnswers / totalQuestionCnt * 100).toFixed(2));
      
      if(curQuestionIndex === totalQuestionCnt - 1){
        setIsFinished(true);
        return;
      }

      setCurQuestionIndex(curQuestionIndex + 1);
      setQuestionData(curQuestionIndex + 1);
    };

    const getRating = (level) => {
        switch (level) {
            case 'easy':
                return 1;
            case 'medium':
                return 2;
            case 'hard':
                return 3;
            default:
                return 1;
        }
    };
    let questionData = questions[curQuestionIndex];
    return (
        <div className="App">
          {
            isFinished === true ? 
              <div className="final_container">
                <h1> Quiz Test is finished.</h1>
                <p> Score: <b>{score}</b>% </p>
                <h4> Total Answers: {rightAnswers}</h4>
                <h4> Correct Answers: {totalQuestionCnt}</h4>
              </div>:
              <Fragment>
                <div style={{backgroundColor:'rgb(169, 169, 169)', width:`${curQuestionIndex / totalQuestionCnt * 100}%`, height: '20px'}}/>
                <div className="main_container">
                    <h1 className="question_status">Question {curQuestionIndex + 1} of {totalQuestionCnt}</h1>
                    <h3 className="category">{decodeURIComponent(questionData.category)}</h3>
                    <StarRatings
                        rating={getRating(questionData.difficulty)}
                        numberOfStars={5}
                        starRatedColor="black"
                        starDimension="15px"
                        starSpacing="1px"
                    />
                    <div className="question" >{decodeURIComponent(questionData.question)}</div>
                    <div className="answers">
                        {
                            answers.map((answer, index) => <div key={index} className={selectedAnswer === index? "answer selected" : "answer"} onClick={onClickAnswer.bind(this, index)}>{decodeURIComponent(answer)}</div>)
                        }
                    </div>
                    <div className="question_result">
                      {questionResult === '' ? <p>&nbsp;</p> : <p>{questionResult}</p>}
                    </div>
                    <div style={{textAlign:'center'}}>
                        <button className="but" onClick={onNext.bind(this)}>Next Question</button>
                    </div>
                <div className="test_result">
                    <div style={{width:'100%', margin: '0 auto 40px auto'}}>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', fontSize: '16px'}}>
                            <span>Score: {score}%</span>
                            <span>Max Score: {maxScore}%</span>
                        </div>
                        <div style={{border: '1px solid black', borderRadius: '3px', height: '20px'}}>
                            <div style={{width: `${minScore}%`,backgroundColor: 'black', height:'100%', display: 'inline-block'}}></div>
                            <div style={{width: `${score - minScore}%`,backgroundColor: 'grey', height:'100%', display: 'inline-block'}}></div>
                            <div style={{width: `${maxScore - score}%`,backgroundColor: 'darkgrey', height:'100%', display: 'inline-block'}}></div>
                        </div>
                    </div>
                </div>
                </div>
            </Fragment>
          }
        </div>
    )
}

export default App