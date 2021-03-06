import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Admin from './admin/admin';
import { connect } from 'react-redux';
import Teacher from './teacher/teacher';
import Student from './student/student';

function Panel({ user }) {
    let component;
    console.log(user);

    if (user.role === 'ROLE_ADMIN') {
        component = Admin;
    } else if (user.role === 'ROLE_TEACHER') {
        component = Teacher;
    } else if (user.role === 'ROLE_STUDENT') {
        component = Student;
    }

    return (
        <>
            <Route path="/panel" component={component} />
        </>
    );
}

Panel.propTypes = {};

function mapStateToProps(state) {
    return {
        user: state.auth.user,
    };
}
export default connect(mapStateToProps)(Panel);
