import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import GroupCollection from './collection';
import UserCollection from '../user/collection';

/**
 * Checks that the group with 'groupId' exists
 */
const isGroupExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.body.groupId);
    const group = validFormat ? await GroupCollection.findGroup(req.body.groupId) : '';
    if (!group) {
      res.status(404).json({
        error: `Group with group ID ${req.body.groupId} does not exist.`
      });
      return;
    }
  
    next();
};

/**
 * Checks that the group with 'groupName' owned by 'owner' exists
 */
const isGroupExistsName = async (req: Request, res: Response, next: NextFunction) => {
  const group =  await GroupCollection.findGroupByName(req.session.userId, req.body.groupName);
  if (!group) {
    res.status(404).json({
      error: `Group with group name ${req.body.groupName} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks that the user is the owner of group with 'groupId'
 */
const isValidGroupModifier = async (req: Request, res: Response, next: NextFunction) => {
    const group = await GroupCollection.findGroup(req.body.groupId);
    const userId = group.owner._id;
    if (req.session.userId !== userId.toString()) {
      res.status(403).json({
        error: 'Cannot modify other users\' groups.'
      });
      return;
    }
  
    next();
};

/**
 * Checks that the user doesn't already have a group with 'name'
 */
const isGroupNameNotInUse = async (req: Request, res: Response, next: NextFunction) => {
    const group = await GroupCollection.findGroupByName(req.session.userId, req.body.groupName);
    if (group) {
      res.status(409).json({
      error: 'A group with this name already exists.'
    });
      return;
    }
    next();
};

/**
 * Checks that 'userId' not already a member of group wiht 'groupName'
 */
const isMemberNotInGroup = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findGroupByName(req.session.userId, req.body.groupName);
  console.log(group.members)
  if (!group.members.includes(req.body.username)){
    res.status(404).json({
      error: `User ${req.body.username} not in group.`
    });
    return;
  }
    next();
};

/**
 * Checks that 'username' is a valid member to be added to group,
 * they need to exist
 * they cannot be the owner themselves,
 * and they cannot be already be a member of the group
 */
const isValidMember = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUsername(req.body.username);
  if (!user) {
    res.status(404).json({
      error: `User ${req.body.username} does not exist.`
    });
    return;
  }
  const group = await GroupCollection.findGroupByName(req.session.userId, req.body.groupName);
  if (group.owner.equals(user._id)){
    res.status(403).json({
      error: `Owner cannot be added to own group`
    });
    return;
  }
  if (group.members.includes(req.body.username)){
    res.status(403).json({
      error: `User ${req.body.username} already in group.`
    });
    return;
  }
  next();
};

export {
    isGroupExists,
    isGroupExistsName,
    isValidGroupModifier,
    isGroupNameNotInUse,
    isMemberNotInGroup,
    isValidMember,
};