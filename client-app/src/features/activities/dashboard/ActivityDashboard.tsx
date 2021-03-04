import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityDetails from '../details/AcitivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface Props {
  activities: Activity[];
  seletedActivity: Activity | undefined;
  selectActivity: (id: string) => void;
  cancelSelectActivity: () => void;
  editMode: boolean;
  openForm: (id: string) => void;
  closeForm: () => void;
  createOrEdit: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
}

export default function ActivityDashboard({ activities, seletedActivity,
  selectActivity, cancelSelectActivity, editMode, openForm, closeForm, createOrEdit, deleteActivity }: Props) {
  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity}
        />
      </Grid.Column>
      <Grid.Column width='6'>
        {
          seletedActivity && !editMode &&
          <ActivityDetails
            activity={seletedActivity}
            cancelSelectActivity={cancelSelectActivity}
            openForm={openForm}
          />
        }
        {
          editMode &&
          <ActivityForm
            closeForm={closeForm}
            activity={seletedActivity}
            createOrEdit={createOrEdit}
          />
        }
      </Grid.Column>
    </Grid>
  )
}