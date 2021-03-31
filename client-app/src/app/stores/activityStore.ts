import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { Pagination, PagingParams } from "../models/pagination";
import { Profile } from "../models/profile";
import { store } from "./store";


export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();

  constructor() {
    makeAutoObservable(this)
  }

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  }

  //computed property
  get axiosParams() {
    const params = new URLSearchParams();
    params.append('pageNumber', this.pagingParams.pageNumber.toString());
    params.append('pageSize', this.pagingParams.pageSize.toString());
    return params;
  }


  //computed property
  get activitiesSortByDate() {
    return Array.from(this.activityRegistry.values())
      .sort((a, b) => a.date!.getTime() - b.date!.getTime());
  }

  //computed property, grouping activities by date
  get groupedActivities() {
    return Object.entries(
      // help : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
      this.activitiesSortByDate.reduce((tempActivities, activity) => {
        const date = format(activity.date!, 'dd MMM yyyy');
        tempActivities[date] = tempActivities[date] ? [...tempActivities[date], activity] : [activity];
        return tempActivities;
      }, {} as { [key: string]: Activity[] })
    )
  }


  loadActivities = async () => {
    try {
      this.loadingInitial = true;
      const result = await agent.Activities.list(this.axiosParams);
      result.data.forEach(activity => {
        this.setActivity(activity);
      });
      this.setPagination(result.pagination);
      this.setLoadingIntial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingIntial(false);
    }
  }

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
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
        this.setActivity(activity);
        runInAction(() => this.selectedActivity = activity);
        this.setLoadingIntial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingIntial(false);
      }
    }
  }

  private setActivity(activity: Activity) {
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees!.some(
        a => a.username === user.username
      );
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find(x => x.username === activity.hostUsername)
    }
    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  }

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  setLoadingIntial = (state: boolean) => {
    this.loadingInitial = state;
  }

  createActivity = async (activityFormValues: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    try {
      await agent.Activities.create(activityFormValues);
      const newActivity = new Activity(activityFormValues);
      newActivity.hostUsername = user!.username;
      newActivity.attendees = [attendee];
      this.setActivity(newActivity);
      runInAction(() => this.selectedActivity = newActivity)
    } catch (error) {
      console.log(error);
    }
  }

  updateActivity = async (activityFormValues: ActivityFormValues) => {
    try {
      await agent.Activities.update(activityFormValues);
      runInAction(() => {
        if (activityFormValues.id) {
          //spread operator
          let updatedActivity = { ...this.getActivity(activityFormValues.id), ...activityFormValues }
          this.activityRegistry.set(activityFormValues.id, updatedActivity as Activity);
          this.selectedActivity = updatedActivity as Activity;
        }
      })
    } catch (error) {
      console.log(error);
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
      runInAction(() => this.loading = false)
    }
  }

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      if (this.selectedActivity?.isGoing) {
        this.selectedActivity.attendees =
          this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
        this.selectedActivity.isGoing = false;
      } else {
        const attendee = new Profile(user!);
        this.selectedActivity?.attendees?.push(attendee);
        this.selectedActivity!.isGoing = true;
      }
      this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => this.loading = false)
    }
  }

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => this.loading = false)
    }
  }

  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  }

  updateAttendeeFollowing = (username: string) => {
    this.activityRegistry.forEach(activity => {
      activity.attendees.forEach(attendee => {
        if (attendee.username === username) {
          attendee.following ? attendee.followersCount-- : attendee.followersCount++;
          attendee.following = !attendee.following;
        }
      })
    })
  }
}
