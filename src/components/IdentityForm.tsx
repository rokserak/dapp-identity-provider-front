import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader, FormControl,
  IconButton,
  TextField
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { Controller, useForm } from "react-hook-form";
import { useIdentityProvider, useNftStorage } from "../hooks";
import { Edit, Person } from "@mui/icons-material";

interface Props {
  onProfileClicked: () => void
}

interface IFormInput {
  given_name: string
  middle_name: string
  family_name: string
  nickname: string
  email: string
  picture: string
}

export const IdentityForm: React.FC<Props> = (props: Props) => {
  const identityProvider = useIdentityProvider()
  const storage = useNftStorage()

  const [loading, setLoading] = useState<boolean>(false)
  const [alreadyExists, setAlreadyExists] = useState<boolean>(false)

  const { control, handleSubmit, setValue, getValues } = useForm<IFormInput>({
    defaultValues: {
      given_name: '',
      middle_name: '',
      family_name: '',
      nickname: '',
      email: '',
      picture: '',
    }
  })

  const [pictureFile, setPictureFile] = useState<File>()
  const [picture, setPicture] = useState<string>()

  const addFile = async (file: File): Promise<string> => {
    if (!storage) {
      return '#'
    }

    const metadata = await storage.store({
      name: getValues('nickname') + '.profile-pic',
      description: "Profile picture of " + getValues('nickname'),
      image: file,
    })
    return metadata.data.image.href.replace('ipfs://', 'https://nftstorage.link/ipfs/')
  }

  const submitData = async (data: IFormInput) => {
    if (!identityProvider) {
      return
    }
    setLoading(true)

    if (pictureFile) {
      // @ts-ignore
      data.picture = await addFile(pictureFile)
    } else {
      data.picture = picture || '#'
    }

    identityProvider.addUser(data)
      .then(tx => {
        console.log('User added')
        tx.wait().then(() => {
          setLoading(false)
        })
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!identityProvider) {
      return
    }

    identityProvider.getUserInfo().then((userInfo: IFormInput) => {
      const _userInfo = Object.assign({}, userInfo)
      console.log(userInfo.picture)

      const _picture = userInfo.picture
      if (_picture) {
        _userInfo.picture = ''
        setPicture(_picture)
      }

      // @ts-ignore
      Object.entries(_userInfo).forEach(([key, value]) => setValue(key, value))
      console.log(userInfo)

      // @ts-ignore
      if (userInfo?.updated_at?.toNumber() > 0) {
        setAlreadyExists(true)
      }
    }).catch(console.log)
  }, [identityProvider, setValue])

  // @ts-ignore
  const onFileUpload = event => {
    console.log(event)
    if (event.target.files) {
      setPictureFile(event.target.files[0])
      setPicture(URL.createObjectURL(event.target.files[0]))
    }
  }

  return (
    <Card variant="outlined" style={{ margin: 20 }}>
      <CardHeader title="Permanently store your Identity on Ethereum Platform" action={<IconButton onClick={props.onProfileClicked}>
        <Person />
      </IconButton>} />

      <CardContent>
        <form onSubmit={handleSubmit(submitData)}>
          <Box sx={{ display: "flex", alignItems: "center", paddingY: 1 }}>
            <Controller name="nickname"
                        control={control}
                        render={({ field }) =>
                          <FormControl fullWidth sx={{ m: 1 }}>
                            <TextField {...field}
                                       variant="outlined"
                                       label="Username" />
                          </FormControl>} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", paddingY: 1, marginX: 1 }}>
            <Controller name="given_name"
                        control={control}
                        render={({ field }) => <TextField {...field}
                                                          style={{ marginRight: 5 }}
                                                          variant="outlined"
                                                          label="First Name" />} />
            <Controller name="middle_name"
                        control={control}
                        render={({ field }) => <TextField {...field}
                                                          style={{ margin: 5 }}
                                                          variant="outlined"
                                                          label="Middle Name" />} />
            <Controller name="family_name"
                        control={control}
                        render={({ field }) => <TextField {...field}
                                                          style={{ marginLeft: 5 }}
                                                          variant="outlined"
                                                          label="Last Name" />} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", paddingY: 1 }}>
            <Controller name="email"
                        control={control}
                        render={({ field }) =>
                          <FormControl fullWidth sx={{ m: 1 }}>
                            <TextField {...field}
                                       variant="outlined"
                                       label="Email" />
                          </FormControl>} />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", paddingY: 1 }}>
            {picture && <div>
              <Avatar src={picture} sx={{ width: 500, height: 500 }} />
            </div>}

            <Controller name="picture"
                        control={control}
                        render={({ field }) => <>
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            onChange={onFileUpload}
                            type="file"
                            value={field.value}
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref} />
                          <label htmlFor="raised-button-file">
                            {picture
                              ? <IconButton disabled={loading}
                                            component="span">
                                  <Edit />
                                </IconButton>
                              : <Button variant="outlined"
                                       component="span"
                                       disabled={loading}>
                                Add Profile Picture
                               </Button>
                            }
                          </label>
                        </>} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", paddingY: 1 }}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <LoadingButton variant="outlined"
                             type="submit"
                             className="grid-row"
                             loading={loading}>
                {alreadyExists ? 'Update' : 'Upload'}
              </LoadingButton>
            </FormControl>
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}
