import React , {Fragment, useState} from 'react'
import {Link, withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addLand} from '../../actions/land'

const AddLand = ({addLand,profile:{profile}}) => {
    
    const [formData,setFormData]= useState({
        fcn: "createLand",
        peers: ["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"dRealEstate",
        channelName: "mychannel",
        args: [],
        username:`${profile.fabricUsername}`,
        orgName:"Org1"
  
      })
      const [landData,setLandData]=useState({
          landId:"",
          areaCode:"",
          length:"",
          breadth:"",
          area:"",
          owner:profile.fabricUsername,
          price:"",
          forSale:"",
          Address:""
      })
      const {
        landId,
        areaCode,
        length,
        breadth,
        area,
        owner,
        price,
        forSale,
        Address
      }= landData

      const onChange = e =>
      setLandData({
            ...landData,
            [e.target.name]:e.target.value
        })

      const onSubmit = e =>{
        e.preventDefault()
        setFormData({
            ...formData,
            args: [landData["landId"],
            landData["areaCode"],
            landData["length"],
            landData["breadth"],
            landData["area"],
                profile.fabricUsername,
                ["price"],
                landData["forSale"],
                landData["Address"]
            ]
        })
        
        
         addLand(formData)
    }
 
    
      return (
        
            <Fragment>
            <h1 className="large text-primary">
               Add your Land
            </h1>

            <form className="form" onSubmit={(e)=>onSubmit(e)}>
        
            <div className="form-group">
          <input type="text" placeholder="Land ID" name="landId" value={landId} onChange={e=>onChange(e)} />
          <small className="form-text"
            >Enter land ID suggestion (ex :land12, land15)</small
          >
        </div>

        <div className="form-group">
          <input type="text" placeholder="areaCode" name="areaCode" value={areaCode} onChange={e=>onChange(e)} />
          <small className="form-text"
            >Enter Area Code</small
          >
        </div>

        <div className="form-group">
          <input type="text" placeholder="length" name="length" value={length} onChange={e=>onChange(e)} />
          <small className="form-text"
            >Enter the length of the plot </small
          >
        </div>

        <div className="form-group">
          <input type="text" placeholder="breadth" name="breadth" value={breadth} onChange={e=>onChange(e)} />
          <small className="form-text"
            >Enter the breadth of the plot</small
          >
        </div>

        <div className="form-group">
          <input type="text" placeholder="price" name="price" value={price} onChange={e=>onChange(e)} />
          <small className="form-text"
            >Enter the Price of the plot</small
          >
        </div>
        

        <div className="form-group">
          <input type="text" placeholder="area" name="area" value={area} onChange={e=>onChange(e)} />
          <small className="form-text"
            >Enter the total area of the plot</small
          >
        </div>
        <div className="form-group">
          <input type="text" placeholder="Address" name="Address" value={Address} onChange={e=>onChange(e)} />
          <small className="form-text"
            >Enter ur address </small
          >
        </div>

        <div className="form-group">
          <select name="forSale" value={forSale} onChange={e=>onChange(e)}>
          <option value="0">* Select your sale state</option>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
          <small className="form-text"
            >Give us an idea of what are you trying to acheive using this</small
          >
        </div>

       
        <input type="submit" className="btn btn-primary my-1" />
      </form>

            </Fragment>
            
      
    )
}
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth
});


AddLand.propTypes = {
    profile:PropTypes.object.isRequired,
    

}

{/* // withROuter allows us to pass history */}
export default connect(mapStateToProps,{addLand}) (AddLand)
