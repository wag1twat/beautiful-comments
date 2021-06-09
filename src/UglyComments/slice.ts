import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Comment, Post, User } from "types";

export interface UglyCommentsState {
  isLoadingСomments: boolean;
  errorComments: null | string;
  comments: Comment[];
  isLoadingPosts: boolean;
  errorPosts: null | string;
  posts: Post[];
  isLoadingUsers: boolean;
  errorUsers: null | string;
  users: User[];
}

const initialState: UglyCommentsState = {
  isLoadingСomments: false,
  errorComments: null,
  comments: [],
  isLoadingPosts: false,
  errorPosts: null,
  posts: [],
  isLoadingUsers: false,
  errorUsers: null,
  users: [],
};

const fetchUsers = () => {
  return axios.get<User[]>("https://jsonplaceholder.typicode.com/users");
};

const fetchPosts = (userId: string) => {
  return axios.get<Post[]>(
    `https://jsonplaceholder.typicode.com/users/${userId}/posts`
  );
};

const fetchCommentByPostId = (id: string) => {
  return axios.get<Comment[]>(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`
  );
};

export const getCommentByPostId = createAsyncThunk<
  Comment[] | undefined,
  string,
  { rejectValue: string | undefined }
>("getCommentByPostId", async (id: string, { rejectWithValue }) => {
  try {
    const response = await fetchCommentByPostId(id);

    return response.data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const getPosts = createAsyncThunk<
  Post[] | undefined,
  string,
  { rejectValue: string | undefined }
>("getPosts", async (userId: string, { rejectWithValue }) => {
  try {
    const response = await fetchPosts(userId);

    return response.data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const getUsers = createAsyncThunk<
  User[] | undefined,
  void,
  { rejectValue: string | undefined }
>("getUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchUsers();

    return response.data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const UglyFormSlice = createSlice({
  name: "UglyFormSlice",
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build.addCase(getCommentByPostId.pending, (state, _) => {
      return {
        ...state,
        isLoadingComments: true,
        errorComments: null,
        comments: [],
      };
    });
    build.addCase(getCommentByPostId.fulfilled, (state, { payload = [] }) => {
      return {
        ...state,
        isLoadingComments: false,
        errorComments: null,
        comments: payload,
      };
    });
    build.addCase(getCommentByPostId.rejected, (state, { payload }) => {
      return {
        ...state,
        isLoading: false,
        error: payload || null,
        comments: [],
      };
    });
    build.addCase(getPosts.pending, (state, _) => {
      return { ...state, isLoadingPosts: true, errorPosts: null, posts: [] };
    });
    build.addCase(getPosts.fulfilled, (state, { payload = [] }) => {
      return {
        ...state,
        isLoadingPosts: false,
        errorPosts: null,
        posts: payload,
      };
    });
    build.addCase(getPosts.rejected, (state, { payload }) => {
      return {
        ...state,
        isLoading: false,
        error: payload || null,
        posts: [],
      };
    });
    build.addCase(getUsers.pending, (state, _) => {
      return { ...state, isLoadingUsers: true, errorUsers: null, users: [] };
    });
    build.addCase(getUsers.fulfilled, (state, { payload = [] }) => {
      return {
        ...state,
        isLoadingUsers: false,
        errorUsers: null,
        users: payload,
      };
    });
    build.addCase(getUsers.rejected, (state, { payload }) => {
      return {
        ...state,
        isLoading: false,
        error: payload || null,
        users: [],
      };
    });
  },
});
