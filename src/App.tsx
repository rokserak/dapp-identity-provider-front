import React, { useEffect } from 'react'
import './App.css'
import { Symfoni } from './hardhat/SymfoniContext'
import { IdentityForm } from './components/IdentityForm'
import { IdentityProfile } from './components/IdentityProfile'
import { Alert } from '@mui/material'

function App() {
  const [metamaskAvailable, setMetamaskAvailable] = React.useState(false)

  useEffect(() => {
    if (window.ethereum) {
      setMetamaskAvailable(true)
    }
  }, [])

  const [showContext, setShowContext] = React.useState<'edit-form' | 'profile-form'>('profile-form')

  const goToEdit = () => {
    setShowContext('edit-form')
  }

  const goToProfile = () => {
    setShowContext('profile-form')
  }

  return (
    <div className="App">
      <header className="App-header">
        {metamaskAvailable
        ? <div>
          <Symfoni autoInit={true}>
            {showContext === 'edit-form'
              ? <IdentityForm onProfileClicked={goToProfile} />
              : <IdentityProfile onEditClicked={goToEdit} />
            }
          </Symfoni>
        </div>
        : <div>
          <Alert severity="error">App requestes Metamask extension to operate, please install it and refresh tab</Alert>
        </div>}
      </header>
    </div>
  )
}

export default App
