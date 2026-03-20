import "./user-not-found.css";
import { UserNotFoundIco } from '../../../../assets/icons/UserNotFoundIco.tsx';

export const UserNotFound = () => (
  <div className={"user-not-found-container"}>
    <UserNotFoundIco className={"user-not-found-icon"} />
    <span>Sorry, we couldn't find a user matching your request.</span>
  </div>
)

