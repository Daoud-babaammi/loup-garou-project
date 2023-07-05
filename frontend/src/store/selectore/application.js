import { createSelector } from "@reduxjs/toolkit";

const applicationSelector = (state) => state.application;

export const isNightSelector = createSelector(applicationSelector, (state) => state.isNight)

export const roleSelector = createSelector(applicationSelector, (state) => state.role )