import React, {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../context/auth.context'
import { useHttp } from '../hooks/http.hook'
import { useHistory } from 'react-router-dom'

export const CreatePage = () => {
  const auth = useContext(AuthContext)
  const {request} = useHttp();
  const [link, setLink] = useState('');
  const history = useHistory()

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  const pressHandler = async event => {
    if (event.key === 'Enter') {
      try {
        const data = await request(
          '/api/link/generate',
          'POST',
          {from: link},
          {Authorization: `Bearer ${auth.token}`}
        );
        history.push(`/detail/${data.link._id}`)
        console.log(data)
      } catch(e) {

      }
    }
  }
  return (
    <div className="row">
      <div className="col s8 offset-s2" style={{padding: '2rem'}}>
        <div className="input-field">
          <input 
            placeholder="Enter link"
            id="link"
            type="text"
            value={link}
            onChange={e => setLink(e.target.value)}
            onKeyPress={pressHandler}
          />
          <label htmlFor="link">Enter link</label>
        </div>
      </div>
    </div>
  )
}