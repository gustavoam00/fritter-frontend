import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReactionCollection from './collection';
import ReactionModel from './model';

/**
 * Checks that reaction with 'reactionId' exists
 */
const isReactionExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.reactionId);
  const reaction = validFormat ? await ReactionCollection.findOne(req.params.reactionId) : '';
  if (!reaction) {
    res.status(404).json({
      error: {
        ReactionNotFound: `Reaction with reaction ID ${req.params.reactionId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the user logged in is the author of reaction with 'reactionID'
 */
const isValidReactionModifier = async (req: Request, res: Response, next: NextFunction) => {
  const reaction = await ReactionCollection.findOne(req.params.reactionId);
  const userId = reaction.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' reactions'
    });
    return;
  }

  next();
};

/**
 * Checks if the freet was already reacted to by user
 */
const isFreetReacted = async (req: Request, res: Response, next: NextFunction) => {
  const result = await ReactionModel.findOne({authorId: req.session.userId, freetId: req.params.freetId})
  if (result) {
    res.status(403).json({
      error: 'Cannot react twice'
    });
    return;
  }
    next();
};;

export {
  isReactionExists,
  isValidReactionModifier,
  isFreetReacted
};
