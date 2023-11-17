import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import '@aws-amplify/ui-react/styles.css';
import { withAuthenticator, Heading, Image, View, Card } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import { Amplify , Auth, API, graphqlOperation }  from 'aws-amplify';
import {listTodos} from './graphql/queries';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-indigo/theme.css";



import { DataView } from 'primereact/dataview';
import 'primeflex/primeflex.css';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';


        
        



Amplify.configure(awsconfig);

function App({Component, pageProps}) {

const [apartments, setApartments] = useState([]);

const fetchApartments = async() => {
  try{
    const apartmentsData = await API.graphql(graphqlOperation(listTodos));
    const apartmentsList = apartmentsData.data.listTodos.items;

    setApartments(apartmentsList);
    console.log('apartments list', apartmentsList);
  }
  catch (error){
    console.log('error on fetching apartments', error);

  }
}

useEffect(() => {
  fetchApartments(); 
}, []);

  useEffect(() => {
    checkUser(); 
  }, []);

  const checkUser = async () => {
    try {
      await Auth.currentAuthenticatedUser();
    } catch (error) {
      console.log('User not signed in');
    }
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const itemTemplate = (apartment) => {
    return (
        <div className="col-12">
            <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src='https://expat-immo.com/wp-content/uploads/2022/02/relook-studio-appartement-paris-2.jpg' alt={apartment.name} />
                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{apartment.title}</div>
                        <Rating value={4} readOnly cancel={false}></Rating>
                        <div className="flex align-items-center gap-3">
                            <span className="flex align-items-center gap-2">
                                <i className="pi pi-tag"></i>
                                <span className="font-semibold">{apartment.description}</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                        <span className="text-2xl font-semibold">20 000 FCFA</span>
                        <Button icon="pi pi-shopping-cart" className="p-button-rounded" ></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

  return (
    <PrimeReactProvider>
      <View className='App'>
        <Card>
        <Heading level={1}>ResidencesMeubles.com </Heading>

        </Card>
        <div className="card">
            <DataView value={apartments} itemTemplate={itemTemplate} />
        </div>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </View>
    </PrimeReactProvider>
  
  );
}

export default withAuthenticator(App);
