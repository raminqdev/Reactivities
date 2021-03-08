import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";


export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = true;

  constructor() {
    makeAutoObservable(this)
  }

  //computed property
  get activitiesSortByDate() {
    return Array.from(this.activityRegistry.values())
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  //computed property, grouping activities by date
  get groupedActivities() {
    return Object.entries(
      // help : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
      this.activitiesSortByDate.reduce((tempActivities, activity) => {
        const date = activity.date;
        tempActivities[date] = tempActivities[date] ? [...tempActivities[date], activity] : [activity];
        return tempActivities;
      }, {} as { [key: string]: Activity[] })
    )
  }


  loadActivities = async () => {
    try {
      this.loadingInitial = true;
      const activities = await agent.Activities.list();
      activities.forEach(activity => {
        this.setActivityDate(activity);
      })
      this.setLoadingIntial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingIntial(false);
    }
  }

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        this.setActivityDate(activity);
        runInAction(() => {
          this.selectedActivity = activity;
        });
        this.setLoadingIntial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingIntial(false);
      }
    }
  }

  private setActivityDate(activity: Activity) {
    activity.date = activity.date.split('T')[0];
    this.activityRegistry.set(activity.id, activity);
  }

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  setLoadingIntial = (state: boolean) => {
    this.loadingInitial = state;
  }

  createActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  updateActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      })
    }
  }
}
