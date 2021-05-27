import { Switch, Route, Redirect } from 'react-router-dom';
import { findIndex, kebabCase, includes } from 'lodash';

const CheckoutProcess = ({
  id,
  baseId,
  layout: Layout,
  routes,
  exitUrl,
  finishUrl,
  onCompleted,  
  apiUrl,
  hideStepper,
  options,
  excludeStepCount,
  ...props
}) => {
  const pathes = routes.map((r) => `${props.match.path}/${r.path}`);
  const currentPathIndex = findIndex(
    routes,
    (r) => props.location.pathname === `${props.match.path}/${r.path}`
  );
  const idPrefix = kebabCase(props.match.path);
  const exitId = `${idPrefix}.exit`;
  const submitted = includes(props.location.search, 'submitted=true');
  
  return (
    <Switch>
      <Redirect
        exact
        from={props.match.path}
        to={`${props.match.path}/${routes[0].path}`}
      />
      <Route path={pathes}>
        <Layout
          id={id}
          exitUrl={exitUrl}
          exitId={exitId}
          finishUrl={finishUrl}
          pathes={pathes}
          option={(options || [])[currentPathIndex] || {}}
          currentPathIndex={currentPathIndex}
          excludeStepCount={excludeStepCount}
          hideStepper={hideStepper}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={`${props.match.path}/${route.path}`}
              render={(props) => {                
                return <route.component 
                  {...props}
                  currentPathIndex={currentPathIndex}
                  pathes={pathes}
                  exitUrl={exitUrl}
                  option={(options || [])[currentPathIndex] || {}}
                  path={routes[currentPathIndex].path}
                  submitted={submitted}
                  idPrefix={idPrefix}
                  apiUrl={apiUrl}
                  />
              }}
            />
          ))}
        </Layout>
      </Route>
    </Switch>
  );
};

export default CheckoutProcess;
