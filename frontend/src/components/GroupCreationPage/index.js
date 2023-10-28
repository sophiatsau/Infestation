import React from 'react'

import GroupForm from '../GroupForm';

export default function GroupCreationPage() {
  window.scroll(0,0);

  return (
    <GroupForm formType="create" />
  )
}

/*
  function updateAbout(e) {
    const newAbout = e.target.value
    setAbout(newAbout);
    if (newAbout.length < 50) {
      setErrors({...errors, about: "Description needs 50 or more characters"})
    } else setErrors({...errors, about: null})
    // console.log(newAbout, newAbout.length, errors)
    console.log(errors.about)
  }
*/
