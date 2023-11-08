"use client";

import { createContext } from 'react';
let user = null;
let username = null;
let leader = null;

export const UserContext = createContext({ user, username, leader });