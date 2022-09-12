import React, { Component } from 'react';
import Container from './Container';
import Footer from './Footer';
import './App.css';
import { getAllStudents } from './client';
import { Table, Avatar, Spin, Modal} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import AddStudentForm from './forms/AddStudentForm';

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
                }));
    }

    render() {
        const {students, isFetching, isAddStudentVisible} = this.state;
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
                        dataSource={students}
                        columns={columns}
                        pagination={false}
                        rowKey='studentId'/>
                    <Modal
                        title='Add new student'
                        open={isAddStudentVisible}
                        onOk={this.closeAddStudentModal}
                        onCancel={this.closeAddStudentModal}
                        width={1000}>
                        <AddStudentForm />
                    </Modal>
                    <Footer
                        numberOfStudents={students.length}
                        handleAddStudentClickEvent={this.openAddStudentModal}>
                    </Footer>
                </Container>
            );
        }
        return (<h1>No students found</h1>);
    }
}

export default App;
