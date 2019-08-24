import _ from "lodash";
import ChatGroupModal from "./../models/chatGroupModel";

let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
  return new Promise( async(resolve, reject) =>  {
    try {
      // add current userId menbers
      arrayMemberIds.unshift({userId: `${currentUserId}`});
      arrayMemberIds =  _.uniqBy(arrayMemberIds, "userId");

      let newGroupItem = {
        name: groupChatName,
        userAmount: arrayMemberIds.length,
        userId: `${currentUserId}`,
        menbers: arrayMemberIds
      }

      let newGroup = await ChatGroupModal.createNew(newGroupItem);

      resolve(newGroup);

    } catch (error) {
      resolve(error);
    }
  })
};

module.exports = {
  addNewGroup
}