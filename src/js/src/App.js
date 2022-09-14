import React, { Component } from 'react';
import Container from './Container';
import Footer from './Footer';
import './App.css';
import { getAllStudents } from './client';
import {Table, Avatar, Spin, Modal, Empty} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import AddStudentForm from './forms/AddStudentForm';
import { errorNotification } from "./Notification";

const getIndicatorIcon = () => <LoadingOutlined style={{fontSize: 24}} spin/>

class App extends Component {

    state = {
        students: [],
        isFetching: false,
        isAddStudentVisible: false
    }

    componentDidMount() {
        this.fetchStudents();
    }

    openAddStudentModal = () =>this.setState({isAddStudentVisible: true})

    closeAddStudentModal = () =>this.setState({isAddStudentVisible:false})

    fetchStudents = () => {
        this.setState({isFetching: true});
        getAllStudents()
            .then(res => res.json()
                .then(students => {
                    this.setState({
                        students,
                        isFetching: false
                    });
                })).catch(error => {
                    //console.log(error.error);
                    const description = error.error.error;
                    const message = error.error.message;
                    errorNotification(message, description);
                    this.setState({isFetching : false});
                });
    }

    render() {

        const {students, isFetching, isAddStudentVisible} = this.state;

        const commonElements = () => (
            <div>
                <Modal
                    title='Add new student'
                    open={isAddStudentVisible}
                    onOk={this.closeAddStudentModal}
                    onCancel={this.closeAddStudentModal}
                    width={1000}>
                    <AddStudentForm onSuccess = {() => {
                        this.closeAddStudentModal();
                        this.fetchStudents();
                    }}/>
                </Modal>
                <Footer
                    numberOfStudents={students.length}
                    handleAddStudentClickEvent={this.openAddStudentModal}/>
            </div>
        )

        if (isFetching) {
            return (
                <Container>
                    <Spin indicator={getIndicatorIcon()}/>
                </Container>
            );
        }
        if (students && students.length) {



            const columns = [
                {
                    title: '',
                    key: 'avatar',
                    render: (text, student) => (
                        <Avatar size='large'>
                            {`${student.firstName.charAt(0).toUpperCase()}${student.lastName.charAt(0).toUpperCase()}`}
                        </Avatar>
                    )

                },
                {
                    title: 'Student Id',
                    dataIndex: 'studentId',
                    key: 'studentId'
                },
                {
                    title: 'First Name',
                    dataIndex: 'firstName',
                    key: 'firstName'
                },
                {
                    title: 'Last Name',
                    dataIndex: 'lastName',
                    key: 'lastName'
                },
                {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email'
                },
                {
                    title: 'Gender',
                    dataIndex: 'gender',
                    key: 'gender'
                }
            ];
            return (
                <Container>
                    <Table
                        style={{paddingBottom:  "70px"}}
                        dataSource={students}
                        columns={columns}
                        pagination={false}
                        rowKey='studentId'/>
                    {commonElements()}
                </Container>
            );
        }
        return (
            <Container>
            <Empty description =
                       {<h1>No Students found</h1>
            }/>
                {commonElements()}
            </Container>
        )
    }
}

export default App;
