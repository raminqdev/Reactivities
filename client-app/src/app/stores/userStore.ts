
import { makeAutoObservable, runInAction } from 'mobx';
import { history } from '../..';
import agent from '../api/agent';
import { User, UserFormValues } from '../models/user';
import { store } from './store';

export default class UserStore {
  user: User | null = null;
  refreshTokenTimeout: any;

  constructor() {
    makeAutoObservable(this)
  }

  //computed property, !! converts to boolean
  get isLoggedIn() {
    return !!this.user;
  }

  setImage = (image: string) => {
    if (this.user) this.user.image = image;
  }

  setDisplayName = (name: string) => {
    if (this.user) this.user.displayName = name;
  }

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.login(creds);
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
      runInAction(() => this.user = user);
      history.push('/activities');
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  }

  logOut = () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem('jwt');
    this.user = null;
    history.push('/');
  }

  getUser = async () => {
    try {
      const user = await agent.Account.current();
      store.commonStore.setToken(user.token);
      runInAction(() => this.user = user);
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  }

  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.register(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => this.user = user);
      history.push('/activities');
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  }

  refreshToken = async () => {
    this.stopRefreshTokenTimer();
    try {
      const user = await agent.Account.refreshToken();
      runInAction(() => this.user = user);
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  }

  private startRefreshTokenTimer(user: User) {
    const jwtToken = JSON.parse(atob(user.token.split('.')[1])); //atob for decoding token
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000); //set timeout to 60 seconds before expire 
    this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

}
