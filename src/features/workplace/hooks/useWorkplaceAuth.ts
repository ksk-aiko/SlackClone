import { useState, useEffect } from 'react';
import { useAuth } from './useAuth.ts';
import { workplaceApi } from '../api/workplaceApi.ts';
import { Workplace } from '../types/workplace.ts';