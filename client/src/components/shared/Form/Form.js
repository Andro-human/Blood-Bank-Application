import React,{useState} from 'react'
import InputType from './InputType'
import {Link} from 'react-router-dom'
import { handleLogin, handleRegister } from '../../../services/authService'

const Form = ({formType, submitBtm, formTitle}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("donor")
    const [name, setName] = useState("")
    const [organisationName, setOrganisationName] = useState("")
    const [hospitalName, setHospitalName] = useState("")
    const [website, setWebsite] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")

    return (
    <div>
      <form onSubmit={(e) => {
        if (formType === 'Login')
          return handleLogin(e, email, password, role)
        else if (formType === 'Register') 
          return handleRegister(e, name, role, email, password, organisationName, hospitalName, website, address, phone)
      }}>
        <h1 className='text-center'>{formTitle}</h1>
        <hr />
        
        <div className='d-flex mb-3' style={{
          justifyContent: "center",
        }}>
          
          <div className="form-check">
            <label className="form-check-label" htmlFor="donorRadio">
              Donor
            </label>
            <input className="form-check-input" type="radio" name="role" id="donorRadio" value={"donor"} onChange={(e) => setRole(e.target.value)} defaultChecked/>
          </div>

          <div className="form-check ms-2">
            <input className="form-check-input" type="radio" name="role" id="adminRadio" value={"admin"} onChange={(e) => setRole(e.target.value)} />
            <label className="form-check-label" htmlFor="adminRadio">
              Admin
            </label>
          </div>
          
          <div className="form-check ms-2">
            <input className="form-check-input" type="radio" name="role" id="hospitalRadio" value={"hospital"} onChange={(e) => setRole(e.target.value)} />
            <label className="form-check-label" htmlFor="hospitalRadio">
              Hospital
            </label>
          </div>
        
          <div className="form-check ms-2">
            <input className="form-check-input" type="radio" name="role" id="organisationRadio" value={"organisation"} onChange={(e) => setRole(e.target.value)} />
            <label className="form-check-label" htmlFor="organisationRadio">
              Organisation
            </label>
          </div>

        </div>
        
        {/* switch statement */}
        {(() => {
        
            switch(true) {
                case formType === "Login": {
                    return (
                        <>
                          <InputType labelText={'Email'} labelFor={"forEmail"} inputType={'email'} name={"email"} value={email} onChange={(e) => setEmail(e.target.value)}  />
                          <InputType labelText={'Password'} labelFor={"forPassword"} inputType={'password'} name={"password"} value={password} onChange={(e) => setPassword(e.target.value)}  />
                        </>
                    );
                }
                case formType === "Register": {
                    return (
                        <>
                         
                          {(role === 'admin' || role === 'donor') && (
                            <InputType labelText={'Name'} labelFor={"forName"} inputType={'text'} name={"name"} value={name} onChange={(e) => setName(e.target.value)}  />
                          )}

                          {(role === 'organisation') && (
                            <div>
                              <InputType labelText={'Organisation Name'} labelFor={"forOrganisationName"} inputType={'text'} name={"organisationName"} value={organisationName} onChange={(e) => setOrganisationName(e.target.value)}  />
                              <InputType labelText={'Website'} labelFor={"forWebsite"} inputType={'text'} name={"website"} value={website} onChange={(e) => setWebsite(e.target.value)}  />
                            </div>
                          )}

                          {(role === 'hospital') && (
                            <div>
                              <InputType labelText={'Hospital Name'} labelFor={"forHospitalName"} inputType={'text'} name={"hospitalName"} value={hospitalName} onChange={(e) => setHospitalName(e.target.value)}  />
                              <InputType labelText={'Website'} labelFor={"forWebsite"} inputType={'text'} name={"website"} value={website} onChange={(e) => setWebsite(e.target.value)}  />
                            </div>
                          )}
                          <InputType labelText={'Email'} labelFor={"forEmail"} inputType={'email'} name={"email"} value={email} onChange={(e) => setEmail(e.target.value)}  />
                          <InputType labelText={'Password'} labelFor={"forPassword"} inputType={'password'} name={"password"} value={password} onChange={(e) => setPassword(e.target.value)}  />
                          <InputType labelText={'Address'} labelFor={"forAddress"} inputType={'text'} name={"address"} value={address} onChange={(e) => setAddress(e.target.value)}  />
                          <InputType labelText={'Phone'} labelFor={"forPhone"} inputType={'text'} name={"phone"} value={phone} onChange={(e) => setPhone(e.target.value)}  />
                        </>
                    )
                }
                default:
            }
        })()}
        
        <div className='d-flex justify-content-between'>
            {(formType === 'Login' ? (
              <p>Not registered yet? Register
                <Link className="ms-1" to="/register">Here !</Link>
              </p>
            ) : (
              <p>Already a user? Please 
              <Link className="ms-1" to="/login">Login !</Link>
              </p>
            ))}
            <button className='btn btn-primary' type='submit' style={{
              height: "40px"
            }}>
                {submitBtm}
            </button>
        </div>
      </form>
    </div>
  )
}

export default Form
