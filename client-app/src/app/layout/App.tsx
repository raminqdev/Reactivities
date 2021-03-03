import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity } from '../models/activity';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';


export default function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      setActivities(response.data);
    })
  }, []);

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '7em' }} >
        <ActivityDashboard activities={activities} />
      </Container>
    </>
  );
}