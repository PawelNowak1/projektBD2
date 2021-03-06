import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    Flex,
    InputRow,
    ModalBackground,
    ModalContent,
    StyledErrorMessage,
} from '../../../../../../../theme/styledComponents';
import Title from '../../../../../../../components/title';
import Input from '../../../../../../../components/input';
import Select from '../../../../../../../components/select';
import SubTitle from '../../../../../../../components/subtitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../../../../../components/button';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {
    API_URL,
    ONLY_NUMBERS_REGEX,
} from '../../../../../../../theme/constans';
import { connect } from 'react-redux';
import { getCookie } from '../../../../../../../theme/cookies';
import CheckBox from "../../../../../../../components/checkbox";
import DatePicker from "../../../../../../../components/datePicker";
import {getStateCode} from "../../../sections/sectionStates";
import Spinner from "../../../../../../../components/spinner";
import student from "../../../../../student/student";


function AddAttendance(props) {
    const { students, onBack,refetch } = props;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [state, setState] = useState({
        date: '',
        studentAttendanceList: []
    });

    const toggleStudent = (e,studentId) => {
        if(e.target.checked){
            const array = state.studentAttendanceList;
            array.push(studentId);
            setState({
                ...state,
                studentAttendanceList: array
            })
        }else {
            const index = state.studentAttendanceList.findIndex(id => id === studentId);
            const array = state.studentAttendanceList.slice(0,index).concat(state.studentAttendanceList.slice(index+1,state.studentAttendanceList.length));

            setState({
                ...state,
                studentAttendanceList: array
            });
        }
    };

    const sendAttendance = () => {
        setLoading(true);
        axios.post(`${API_URL}/student/checkaattendances`, {
            date:`${state.date}T12:00:00.000`,
            studentAttendanceList:students.map(student => {
                return ({
                    status: state.studentAttendanceList.find(item => item === student.student.student.id) ? 'present' : 'notpresent',
                    studentSectionId:student.student.studentSectionId
                })
            })
        },{
            headers: {
                Authorization: 'Bearer ' + getCookie('token'),
            },
        }).then((res) => {
            onBack();
            refetch();
        }).catch(err => {
            setLoading(false);
            setError(true);
        });
    };

    return (
        <>
            <ModalBackground
                className={'show'}
                onClick={onBack}
            >
                <ModalContent
                    maxWidth="550px"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Flex jc="space-between">
                        <Title secondary>Dodawanie obecności</Title>
                        <div onClick={onBack}>
                            <FontAwesomeIcon icon={faTimesCircle} />
                        </div>
                    </Flex>
                    {
                        error &&
                            <p>Nie udało się :/</p>
                    }
                    <Content>
                        <Row>
                            <div>
                                Imie i Nazwisko
                            </div>
                            <div>
                                <DatePicker label="Data" value={state.date} onChange={(e) => setState({...state,date:e.target.value})}/>
                            </div>
                        </Row>
                        {
                            students.map(student =>
                                <Row>
                                    <h2>
                                        {student.student.student.firstName} {student.student.student.lastName}
                                    </h2>
                                    <div>
                                        <CheckBox value={state.studentAttendanceList.find(id => id === student.student.student.id)} onChange={(e) => toggleStudent(e,student.student.student.id)}/>
                                    </div>
                                </Row>
                            )
                        }
                    </Content>
                    <Button style={{margin:'0 auto',marginTop:10}} onClick={sendAttendance}>
                        {
                            loading ?
                                <Spinner width={20} height={20} white/>:
                                <>Zapisz obecność</>
                        }
                    </Button>
                </ModalContent>
            </ModalBackground>
        </>
    );
}

AddAttendance.propTypes = {};

function mapStateToProps(state) {
    return {
        user: state.auth.user,
    };
}
export default connect(mapStateToProps)(AddAttendance);

const Row = styled.div`
    margin-bottom: 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2{
        font-size: ${({ theme }) => theme.font.S};
        font-weight: ${({ theme }) => theme.font.Regular};
        color: ${({ theme }) => theme.secondColor};
        margin: 0px;
    }
`;


const Content = styled.div`
  margin-top: 20px;
`;
