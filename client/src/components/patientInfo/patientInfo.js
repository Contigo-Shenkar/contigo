import Header from "../../components/header/Header";
import { tokens } from "../../theme";
import { DataGrid } from '@mui/material';
import {alertNotification} from "../alert/alertNotification";
import {useGetPatientByIdQuery}  from "../../features/apiSlice";

import { Box, 
    Container,
    Avatar,
    Typography, 
    useTheme, 
    Card,
    CardContent, 
    Grid,
    Button,
    CardActions,
    
    
    
} from '@mui/material';


const PatientInfo = ()=> {
    const { data: patients, isLoading, isError } = useGetPatientByIdQuery();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const user = {
        avatar: '../../assets/avatars/avatar-miron-vitold.png',
        Gender: 'Male',
        DateOfBirth: '17/09/2016',
        name: 'Netanel Admoni',
        Department: 'Department D Child Psychiatry'
      }

      
      
  
    return(
        
        <Box m="20px">
          {/* title */}
        <Header title="Patient personal information" subtitle="Welcome to your personal card" />
        {/* child card */}
        <Grid container spacing={7}>
        <Grid item>
        <Card sx={{width: 400, height: 300, borderRadius: 10, backgroundColor: colors.blueAccent[700]}}>
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="small" onClick={() => console.log("Edit clicked!")}>
            Edit
          </Button>
        </CardActions>
        <CardContent sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}> 
          <Button onClick={() => console.log("Avatar clicked!")}>
      <Avatar
        src={user.avatar}
        sx={{
          height: 80,
          mb: 2,
          width: 80,
          cursor: 'pointer'
        }}
      />
      </Button>
      <Typography
        gutterBottom
        variant="h5"
      >
        {user.name}
      </Typography>
      <Typography
        color="text.secondary"
        variant="body2"
      >
        {user.Gender} {user.DateOfBirth}
      </Typography>
      <Typography
        color="text.secondary"
        variant="body2"
      >
        {user.Department}
      </Typography>
    </CardContent>
</Card>


    {/* child graph */}
  </Grid>
  <Grid item>
    <Card sx={{width: 400, height: 300, borderRadius: 10, backgroundColor: colors.blueAccent[700]}}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
        child graph
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla aliquet orci eget nibh ultricies vehicula.
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  {/* child notifications */}
  <Grid item>
    <Card sx={{width: 400, height: 300, borderRadius: 10, backgroundColor: colors.blueAccent[700]}}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Third Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla aliquet orci eget nibh ultricies vehicula.
        </Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>
  
    
  </Box>

        

    );
};




export default PatientInfo;
