import { Card } from '@mui/material';
import { subDays } from 'date-fns';
import UserResultTable from './UserResultTable';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { LocalLaundryServiceSharp } from '@mui/icons-material';
import { User, UserQueryResult } from 'src/models/User';

function UserResult() {

  return (
    <Card>
      <UserResultTable/>
    </Card>
  );
}

export default UserResult;
