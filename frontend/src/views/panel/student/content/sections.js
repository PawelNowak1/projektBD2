import React, {useEffect, useState} from 'react';
import styled from 'styled-components'

function Sections (props) {
    //HOOKI
    const {user,context} = props;

    const [addClient,setAddClient] = useState(false);

    const [loading,setLoading] = useState(false);
    const [refresh,setRefresh] = useState(false);

    const [pageSettings,setPageSettings] = useState({
        activePage:0,
        totalPages:0,
    });
    const [students,setStudents] = useState([]);

    //USEEFFECT


    return(
        <>
            <Wrapper>
            <ContentHeader>
                <h1>Bieżące sekcje</h1>
            </ContentHeader>
            <ContentBody>
                <FiltersWrapper>
                </FiltersWrapper>
                <ContentTable cellspacing="0" cellpadding="0">
                    <tr>
                        <th>Numer sekcji</th>
                        <th>Nazwa sekcji</th>
                        <th>Nauczyciel</th>
                        <th>Email nauczyciela</th>
                    </tr>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>Sekcja1</td>
                        <td>Paduch</td>
                        <td>paduch@polsl.pl</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Sekcja numer 2</td>
                        <td>Baron</td>
                        <td>baron@polsl.pl</td>
                    </tr>
                    </tbody>
                    {
                        students.map(student =>
                            <tr>
                                <td>#{student.id}</td>
                                <td>{student.firstName}</td>
                                <td className="name">{student.lastName}</td>
                                <td>{student.user.email}</td>
                           </tr>
                        )
                    }

                </ContentTable>
                {
                    loading &&
                    <div>Loading ...</div>
                }
                <Pagination>
                </Pagination>
            </ContentBody>
        </Wrapper>
        </>
    )
};

Sections.propTypes = {
};

export default Sections;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  span{
    font-size: ${({theme}) => theme.font.S};
    font-weight: ${({theme}) => theme.font.Regular};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    margin: 5px;
    border-radius: 3px;
    cursor: pointer;
    
    &:hover{
      color: ${({theme}) => theme.primaryColor};
    }
    &.active{
      background: ${({theme}) => theme.primaryColor};
      color: white;
    }
  }
`;
const FiltersWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  >div{
   margin-bottom: 10px;
  }
  >div:first-of-type{
    display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
        >div{
            margin-right: 10px;
         }
  }
  
`;

const StyledOption = styled.option`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font-size: ${({theme}) => theme.font.M};
`;

const PatronSelect = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: ${({theme}) => theme.fourthColor};
  border-radius: 3px;
  padding: 7px 25px;
  border: none;
`;

const ContentTable = styled.table`
 border-collapse:collapse;
  margin-top: 20px;
  width: 100%;
  tr{
    border-bottom: 1px solid ${({theme}) => theme.fourthColor};
    &:first-of-type, &:last-of-type{
       border-bottom: 0px;
    }
  }
  th,td{
    border: none;
    padding: 0px;
  }
  th{
    background: ${({theme}) => theme.fourthColor};
    font-size: ${({theme}) => theme.font.XS};
    font-weight: ${({theme}) => theme.font.Regular};
    color: ${({theme}) => theme.secondColor};
    padding: 6px 8px;
    text-align: left;
    &:first-of-type{
      border-radius: 3px 0 0 3px;
    }
     &:last-of-type{
      border-radius: 3px 0 0 3px;
    }
    &.textAlign-center{
      text-align: center;
    }
  }
  td{
    padding: 8px 8px;
    font-size: ${({theme}) => theme.font.XS};
    color: ${({theme}) => theme.thirdColor};
     font-weight: ${({theme}) => theme.font.Light};
     svg{
      margin: 0 auto;
      display: block;
     }
     &.name{
         color: ${({theme}) => theme.secondColor};
          min-width: 200px;
     }
     &.trash{
      cursor: pointer;
     }
     span{
      text-transform: uppercase;
         font-size: ${({theme}) => theme.font.XS};
         border-radius: 3px;
        padding: 3px 15px;
        font-weight: ${({theme}) => theme.font.Bold};
     }
    &.web{
      span{
        background:  ${({theme}) => theme.greenBackground};
        color: ${({theme}) => theme.green};
      }
    }
    
    &.comperia{
      span{
        background: ${({theme}) => theme.blueBackground};
        color: ${({theme}) => theme.blue};
      }
    }
    
    &.wlasny{
      span{
        background: ${({theme}) => theme.yellowBackground};
        color: ${({theme}) => theme.yellow};
      }
    }
    
    &.patron{
      span{
        height: 35px;
        width: 35px;
        margin: 0 auto;
        display: block;
        background: ${({theme}) => theme.fourthColor};
         font-weight: ${({theme}) => theme.font.Bold};
         font-size: ${({theme}) => theme.font.XS};
         display: flex;
         align-items: center;
         justify-content: center;
      }
    }
  }
`;

const ContentBody = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  background: white;
`;

const Wrapper = styled.div`
  
`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
