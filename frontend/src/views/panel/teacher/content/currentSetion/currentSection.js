import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import Select from "../../../../../components/select";
import {getStateCode, getStateName, sectionStates} from "../sections/sectionStates";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faDownload, faTimes, faTrash, faUser} from "@fortawesome/free-solid-svg-icons";
import Button from "../../../../../components/button";
import {getCookie} from "../../../../../theme/cookies";
import axios from "axios";
import {API_URL} from "../../../../../theme/constans";
import AddAttendance from "./modals/addAttendance/addAttendance";
import Spinner from "../../../../../components/spinner";
import EditMarks from "./modals/editMarks/editMarks";
import {ModalContent} from "../../../../../theme/styledComponents";
import {useHistory} from "react-router-dom";

function CurrentSection (props) {
    const history = useHistory();

    const [refetch,setRefetch] = useState(false);
    const [addAttendance,setAddAttendance] = useState(false);
    const [editMark,setEditMark] = useState(false);
    const [loading,setLoading] = useState(false);
    const [sending,setSending] = useState(false);
    const [section,setSection] = useState({});
    const [students,setStudents] = useState([]);
    const [attendanceDates,setAttendanceDates] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_URL}/sections/students/${props.match.params.id}`, {
                headers: {
                    Authorization: 'Bearer ' + getCookie('token'),
                },
            })
            .then(response => {
                setLoading(false);
                setSection(response.data.section);
                setStudents(response.data.studentsInSection);
                const dates = [];
                response.data.studentsInSection.map(student => {
                    student.student.attendances.map(attendance => {
                        if(attendance.date){
                            const temp = dates.find(date => date === attendance.date);
                            if(temp === undefined){
                                dates.push(attendance.date)
                            }
                        }
                    })
                });

                setAttendanceDates(dates.sort(function(a,b){
                    return new Date(a) - new Date(b);
                }));
            });

    },[refetch]);

    const onChangeStatus = (e) => {
        setSending(true);
        axios.post(`${API_URL}/sections/status/?sectionId=${section.id}&state=${getStateCode(e.target.value)}`, null,{
                headers: {
                    Authorization: 'Bearer ' + getCookie('token'),
                },
            }).then((res) => {
                setSection({
                    ...section,
                    state:getStateCode(e.target.value)
                });
                setSending(false);
            });
    };

    if(loading){
        return (
            <p>Loading ...</p>
        )
    }

    return(
        <>
        <Wrapper>
            <Header>
                {section.name}
                {
                    sending &&
                        <div style={{display:'inline-block',marginLeft:10}}>
                            <Spinner width={20} height={20} white/>
                        </div>
                }
            </Header>
            <Content>
                <InfoBody>
                    <InfoSelect>
                        <div>
                            <Select
                                label="Status"
                                options={[
                                    getStateName(sectionStates.open),
                                    getStateName(sectionStates.closed),
                                    getStateName(sectionStates.cancelled),
                                    getStateName(sectionStates.finished)
                                ]}
                                value={getStateName(section.state)}
                                onChange={onChangeStatus}
                            />
                        </div>
                        {/*<Button style={{margin:'0',marginTop:10}} onClick={() => history.push(`/panel/registered-section/${section.id}`)}>*/}
                        {/*    <FontAwesomeIcon icon={faUser}/> Zapisz oceny*/}
                        {/*</Button>*/}
                    </InfoSelect>
                    <InfoDesc>
                        <h2>Nazwa teamtu</h2>

                        <p>
                            {section.topic && section.topic.name}
                        </p>

                        <h2>Opis tematu</h2>

                        <div>
                           <p>{section.topic && section.topic.description}</p>
                        </div>

                        {/*<h2>Załączniki</h2>*/}

                        {/*<div>*/}
                        {/*    <ul>*/}
                        {/*        <li>zaloacznik_1.pdf</li>*/}
                        {/*        <li>zaloacznik_2.pdf</li>*/}
                        {/*        <li>zaloacznik_3.pdf</li>*/}
                        {/*    </ul>*/}
                        {/*</div>*/}
                        {/*<Button style={{margin:'0 auto',marginTop:'20px'}}>*/}
                        {/*    Dodaj załącznik*/}
                        {/*</Button>*/}

                    </InfoDesc>
                    <div style={{width:'100%',overflowX:'scroll'}}>
                        <ContentTable cellspacing="0" cellpadding="0">
                            <tbody>
                            <tr>
                                <th>Imię i nazwisko</th>
                                <th>Załączniki</th>
                                <th>Komentarz do załącznika</th>
                                <th>Data</th>
                            </tr>
                            {
                                students.map(item =>
                                    <tr>
                                        <td className="name">
                                            {item.student.student.firstName} {item.student.student.lastName}
                                        </td>
                                        <Td>
                                            {
                                                item.student.attachment.map(file =>
                                                    <>
                                                        <a style={{display:'block'}} href={`${API_URL}/file/download/${file.id}`} target="_blank" download> {file.fileName}</a>
                                                    </>
                                                )
                                            }
                                        </Td>
                                        <Td>
                                            {
                                                item.student.attachment.map(file =>
                                                    <p>{file.description}</p>
                                                )
                                            }
                                        </Td>
                                        <Td>
                                            {
                                                item.student.attachment.map(file =>
                                                    <p>{file.insertDate.substring(0,10)}</p>
                                                )
                                            }
                                        </Td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </ContentTable>
                    </div>
                    <div>
                        <div style={{display:'flex',marginTop:20}}>
                            <NameTable>
                                <TableNameHeader>
                                    <div>
                                        Imię i nazwisko
                                    </div>
                                </TableNameHeader>
                                <TableNameContent>
                                    {
                                        students.map(item =>
                                            <div>
                                                    {item.student.student.firstName} {item.student.student.lastName}
                                            </div>
                                        )
                                    }
                                </TableNameContent>
                            </NameTable>
                            <DateTable>
                                <TableDateHeader>
                                    {
                                        attendanceDates.map(date =>
                                            <div>
                                                {date.substring(8,10)}.{date.substring(5,7)}<br/>{date.substring(0,4)}
                                            </div>
                                        )
                                    }

                                </TableDateHeader>
                                <TableDateContent>
                                    {
                                        students.map(student =>
                                            <div>
                                                {
                                                    attendanceDates.map(date =>
                                                        <div>
                                                            {
                                                                student.student.attendances.find(item => item.date === date) && student.student.attendances.find(item => item.date === date).status === "present" ?
                                                                <FontAwesomeIcon icon={faCheck}/> :  <FontAwesomeIcon icon={faTimes}/>
                                                            }
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </TableDateContent>
                            </DateTable>
                            <MarkTable>
                                <TableNameHeader>
                                    <div>
                                        Ocena
                                    </div>
                                </TableNameHeader>
                                <TableNameContent>
                                    {
                                        students.map(item =>
                                            <div style={{textAlign:'center',width:'100%',justifyContent:'center'}}>
                                                {item.mark}
                                            </div>
                                        )
                                    }
                                </TableNameContent>
                            </MarkTable>
                        </div>
                        <div style={{display:'flex',justifyContent:'space-between'}}>
                            <Button style={{margin:'0',marginTop:'20px'}} onClick={() => setAddAttendance(true)}>Dodaj obecność</Button>
                            <Button style={{margin:'0',marginTop:'20px'}} onClick={() => setEditMark(true)}>Edytuj oceny</Button>
                        </div>
                    </div>
                </InfoBody>
            </Content>
        </Wrapper>

        {
            addAttendance &&
                <AddAttendance
                    students={students}
                    sectionId={section.id}
                    refetch={() => setRefetch(!refetch)}
                    onBack={() => setAddAttendance(false)}
                />
        }
            {
                editMark &&
                <EditMarks
                    students={students}
                    refetch={() => setRefetch(!refetch)}
                    onBack={() => setEditMark(false)}
                />
            }
        </>
    )
};

CurrentSection.propTypes = {
};

const Td = styled.td`
  p,a{
    margin: 5px;
  }
`;

const TdLinks = styled.td`
  a,p{
    display: block;
    margin: 5px;
  }
`;

const ContentTable = styled.table`
    border-collapse: collapse;
    margin-top: 20px;
    width: 100%;
    overflow-x: scroll;
    tr {
        border-bottom: 1px solid ${({ theme }) => theme.fourthColor};
        &:first-of-type,
        &:last-of-type {
            border-bottom: 0px;
        }
    }
    th,
    td {
        border: none;
        padding: 0px;
    }
    th {
        background: ${({ theme }) => theme.fourthColor};
        font-size: ${({ theme }) => theme.font.XS};
        font-weight: ${({ theme }) => theme.font.Regular};
        color: ${({ theme }) => theme.secondColor};
        padding: 6px 8px;
        text-align: left;
        &:first-of-type {
            border-radius: 3px 0 0 3px;
        }
        &:last-of-type {
            border-radius: 3px 0 0 3px;
        }
        &.textAlign-center {
            text-align: center;
        }
    }
    td {
        padding: 8px 8px;
        font-size: ${({ theme }) => theme.font.XS};
        color: ${({ theme }) => theme.thirdColor};
        font-weight: ${({ theme }) => theme.font.Light};
        svg {
            margin: 0 auto;
            display: block;
        }
        &.name {
            color: ${({ theme }) => theme.secondColor};
            min-width: 200px;
        }
        &.trash {
            cursor: pointer;
        }
        span {
            text-transform: uppercase;
            font-size: ${({ theme }) => theme.font.XS};
            border-radius: 3px;
            padding: 3px 15px;
            font-weight: ${({ theme }) => theme.font.Bold};
        }
        &.web {
            span {
                background: ${({ theme }) => theme.greenBackground};
                color: ${({ theme }) => theme.green};
            }
        }

        &.comperia {
            span {
                background: ${({ theme }) => theme.blueBackground};
                color: ${({ theme }) => theme.blue};
            }
        }

        &.wlasny {
            span {
                background: ${({ theme }) => theme.yellowBackground};
                color: ${({ theme }) => theme.yellow};
            }
        }

        &.patron {
            span {
                height: 35px;
                width: 35px;
                margin: 0 auto;
                display: block;
                background: ${({ theme }) => theme.fourthColor};
                font-weight: ${({ theme }) => theme.font.Bold};
                font-size: ${({ theme }) => theme.font.XS};
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
`;

const MarkTable = styled.div`
   width: 60px;
`;

const DateTable = styled.div`
  flex: 1;
  overflow-x: scroll;
`;

const TableDateContent = styled.div`       
 >div{
    display: flex;
    >div{
    font-size: ${({ theme }) => theme.font.XS};
  color: ${({ theme }) => theme.thirdColor};
  font-weight: ${({ theme }) => theme.font.Light};
       width: 60px;
           min-width: 60px;
      padding: 6px 8px; 
      text-align: center;
      border-right: 1px solid ${({theme}) => theme.secondColor};
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
   }
`;

const TableDateHeader = styled.div`
  display: flex;
  >div{
    min-width: 60px;
    width: 60px;
   padding: 6px 8px;
    text-align: center;
    border-right: 1px solid ${({theme}) => theme.secondColor};
     background: ${({ theme }) => theme.fourthColor};
  font-size: ${({ theme }) => theme.font.XS};
  font-weight: ${({ theme }) => theme.font.Regular};
  color: ${({ theme }) => theme.secondColor};
  }
`;

const TableNameContent = styled.div`
  div{
     min-height: 44px;
     display: flex;
     align-items: center;
  }
`;

const TableNameHeader = styled.div`
    background: ${({ theme }) => theme.fourthColor};
    font-size: ${({ theme }) => theme.font.XS};
    font-weight: ${({ theme }) => theme.font.Regular};
    color: ${({ theme }) => theme.secondColor};
    text-align: left;
    >div{
      padding: 6px 8px;
      height: 44px;
    }
`;

const NameTable = styled.div`
   width: 300px;
   border-right: 1px solid ${({theme}) => theme.secondColor};
`;

const InfoDesc = styled.div`
  display: grid;
  grid-template-columns: max-content auto;
  grid-gap: 20px;
  margin-top: 30px;
  h2{
  color: ${({theme}) => theme.secondColor};
      font-size: ${({theme}) => theme.font.M};
   font-weight: ${({theme}) => theme.font.Bold};
   margin: 0px;
  }
  p{
   color: ${({theme}) => theme.thirdColor};
   font-size: ${({theme}) => theme.font.S};
   font-weight: ${({theme}) => theme.font.Light};
   margin: 0px;
   margin-bottom: 10px;
   &:last-of-type{
    margin-bottom: 0px;
   }
  }
  ul,li{
   margin: 0px !important;
   list-style: none;
   padding: 0px;
    color: ${({theme}) => theme.thirdColor};
     font-size: ${({theme}) => theme.font.S};
   font-weight: ${({theme}) => theme.font.Light};
  }
`;

const InfoDate = styled.div`
  font-size: ${({theme}) => theme.font.M};
  font-weight: ${({theme}) => theme.font.Light};
  color: ${({theme}) => theme.thirdColor};
  span{
    color: ${({theme}) => theme.secondColor};
     font-weight: ${({theme}) => theme.font.Bold};
     margin-right: 10px;
  }
`;

const InfoSelect = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoBody = styled.div`

`;

const Content = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  width: 100%;
  background: ${({theme}) => theme.primaryColor};
  color: white;
  text-align: center;
  font-size: ${({theme}) => theme.font.L};
  font-weight: ${({theme}) => theme.font.Bold};
  padding: 10px;
  
`;

const Wrapper = styled.div`
  background-color: white;
  flex: 1;
`;

export default CurrentSection;