import React, { useEffect, useState } from 'react'
import './App.css'
import { Symfoni } from './hardhat/SymfoniContext'
import { IdentityForm } from './components/IdentityForm'
import { IdentityProfile } from './components/IdentityProfile'
import { Alert } from '@mui/material'
import { LoadingButton } from "@mui/lab";

function App() {
  const [metamaskAvailable, setMetamaskAvailable] = useState(false)
  const [onSupportedNetwork, setOnSupportedNetwork] = useState(false)

  useEffect(() => {
    if (window.ethereum) {
      setMetamaskAvailable(true)
      setTimeout(() => {
        setOnSupportedNetwork(window.ethereum.networkVersion === process.env.REACT_APP_NETWORK_ID)
      }, 100)
    }
  }, [])

  const switchToSupportedNetwork = async () => {
    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: '0x' + process.env.REACT_APP_NETWORK_ID,
        }
      ],
    }).then(() => setOnSupportedNetwork(true))
  }

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
        {metamaskAvailable && onSupportedNetwork
        ? <div>
          <Symfoni autoInit={true}>
            {showContext === 'edit-form'
              ? <IdentityForm onProfileClicked={goToProfile} />
              : <IdentityProfile onEditClicked={goToEdit} />
            }
          </Symfoni>
        </div>
        : !metamaskAvailable
            ? <div>
              <Alert severity="error">App requires Metamask extension to operate, please install it and refresh tab</Alert>
            </div>
            : <div>
                <Alert severity="error">Unsupported network set in your Metamask wallet</Alert>
                <LoadingButton variant="contained"
                               type="submit"
                               style={{ display: "block", marginTop: "10px", marginLeft: "auto", marginRight: "auto" }}
                               onClick={switchToSupportedNetwork}>
                  Switch to supported network
                </LoadingButton>
              </div>
        }
      </header>
    </div>
  )
}

export default App
