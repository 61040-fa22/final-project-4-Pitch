import type {Request, Response} from 'express';
import express from 'express';

import TagCollection from "./collection";

import * as UserValidator from '../user/middleware';

const router = express.Router();

/**
 * Create a Tag entry in the database
 *
 * @name POST /api/tag/:contentId
 *
 * @param contentId - ID of content
 * @param body.tagname - Name of tag
 * @return {} - The created Tag
 *
 * @throws {403} - User is not logged in
 * @throws {403} - User does not own this content
 * @throws {404} - Content does not exist
 * @throws {409} - This tag already exists for this content
 */
router.post(
  '/:contentId',
  [
    UserValidator.isUserLoggedIn,  // 403
    // TODO content exists
  ],
  async (req: Request, res: Response) => {
    const contentId = req.params.contentId;
    const tagname = req.body.tagname;
    const tag = await TagCollection.addOne(contentId, tagname);

    res.status(201).json({
      message: 'You have successfully tagged the content',
      tag
      // tag: constructTagResponse(tag) // TODO util.
    });
  }
);

/**
 * Get all tags on content
 *
 * @param contentId - id of content
 * @return {} - list of all tagnames on content
 *
 * @throws {404} Content does not exist
 */
router.get(
  '/:contentId?',
  [
    // TODO content exists
  ],
  async (req: Request, res: Response) => {
    const contentId = req.params.contentId;
    const tags = await TagCollection.findAllByContentId(contentId);

    res.status(200).json({
      message: 'Here are all tags on content',
      tags
    });
  }
);

/**
 * Delete tag on content with tagname
 *
 * @param contentId - id of content
 * @param body.tagname - tagname of tag
 *
 * @throws {403} - User is not logged in
 * @throws {403} - USer does not own this content
 * @throws {404} - Content does not exist
 * @throws {409} - This tag does not exist
 */
router.delete(
  '/:contentId?',
  [
    UserValidator.isUserLoggedIn,  // 403
    // TODO content exists
  ],
  async (req: Request, res: Response) => {
    const contentId = req.params.contentId;
    const tagname = req.body.tagname;
    await TagCollection.deleteOne(contentId, tagname);

    res.status(200).json({
      message: `Deleted ${tagname} on ${contentId}`
    });
  }
);
