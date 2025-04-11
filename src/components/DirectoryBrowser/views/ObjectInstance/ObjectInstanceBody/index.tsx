import { Outlet, useParams } from 'react-router'

import GraphImg from '../../../../../assets/directory_graph.svg'
import IncomingRelationsImg from '../../../../../assets/incoming_relations.svg'
import JsonImg from '../../../../../assets/json.svg'
import OutgoingRelationsImg from '../../../../../assets/outgoing_relations.svg'
import PropertiesImg from '../../../../../assets/properties.svg'
import { NavTab, TabGroup } from './styles'

const ObjectInstanceBody = () => {
  const { objectType, objectId } = useParams()

  return (
    <>
      <TabGroup>
        <NavTab to={`/ui/directory/objects/${objectType}/${objectId}/graph`}>
          <img alt="graph-icon" src={GraphImg} />
          <span className="tab-name">Graph</span>
        </NavTab>
        <NavTab
          to={`/ui/directory/objects/${objectType}/${objectId}/properties`}
        >
          <img alt="" src={PropertiesImg} />
          <span className="tab-name">Properties</span>
        </NavTab>
        {objectType && (
          <NavTab
            to={`/ui/directory/objects/${objectType}/${objectId}/incoming-relations`}
          >
            <img alt="" src={IncomingRelationsImg} />
            <span className="tab-name">Incoming Relations</span>
          </NavTab>
        )}
        <NavTab
          to={`/ui/directory/objects/${objectType}/${objectId}/outgoing-relations`}
        >
          <img alt="" src={OutgoingRelationsImg} />
          <span className="tab-name">Outgoing Relations</span>
        </NavTab>
        <NavTab to={`/ui/directory/objects/${objectType}/${objectId}/json`}>
          <img alt="" src={JsonImg} />
          <span className="tab-name">JSON</span>
        </NavTab>
      </TabGroup>
      <Outlet />
    </>
  )
}

export default ObjectInstanceBody
