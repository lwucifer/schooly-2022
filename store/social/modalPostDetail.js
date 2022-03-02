import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { POSTS as ENDPOINT_POSTS } from "~/utils/endpoints";
import Posts from "~/services/social/Posts";

/**
 * initial state
 */
const state = () => ({
  post: {},
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.MODAL_POST_DETAIL.GET_POST](
    { state, commit },
    { postId, parentPostId } = {}
  ) {
    try {
      const result = parentPostId
        ? await this.$axios.$get(
            `${ENDPOINT_POSTS}/${parentPostId}/children/${postId}`
          )
        : await this.$axios.$get(`${ENDPOINT_POSTS}/${postId}`);

      if (!result.error) {
        const post = {
          ...(result.data || {}),
          $commentTree: [],
        };
        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, post);
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.EDIT_POST](
    { state, commit },
    { childPath, model } = {}
  ) {
    try {
      const { data: result = {} } = await new Posts(this.$axios)[
        actionTypes.BASE.PATCH
      ](childPath, model);

      if (!result.error) {
        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, {
          ...state.post,
          ...(result.data || {}),
        });
      }

      return result;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.DELETE_POST](
    { state, commit },
    payload
  ) {
    try {
      const result = await new Posts(this.$axios)[actionTypes.BASE.DELETE](
        payload
      );

      if (result.success) {
        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, {});
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.LIKE_POST](
    { state, commit },
    { parentPostId, postId, model } = {}
  ) {
    try {
      const result = await this.$axios.$post(
        parentPostId
          ? `${ENDPOINT_POSTS}/${parentPostId}/children/${postId}/reactions`
          : `${ENDPOINT_POSTS}/${postId}/reactions`,
        model
      );

      if (!result.error) {
        const { data = {} } = result;
        const { post = {} } = state;

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, {
          ...post,
          counter: {
            ...post.counter,
            reaction: post.counter.reaction + 1,
          },
          reaction: {
            created_at: data.created_at,
            emoji: data.emoji,
          },
        });
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.DELETE_LIKE_POST](
    { state, commit },
    { parentPostId, postId, model } = {}
  ) {
    try {
      const result = await this.$axios.$request({
        url: parentPostId
          ? `${ENDPOINT_POSTS}/${parentPostId}/children/${postId}/reactions`
          : `${ENDPOINT_POSTS}/${postId}/reactions`,
        data: model,
        method: "DELETE",
      });

      if (!result.error) {
        const { post = {} } = state;

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, {
          ...post,
          counter: {
            ...post.counter,
            reaction: post.counter.reaction - 1,
          },
          reaction: null,
        });
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.CLEAR_POST]({ commit }) {
    commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, {});
  },

  async [actionTypes.MODAL_POST_DETAIL.GET_COMMENT](
    { state, commit },
    { parentPostId, postId, ...params } = {}
  ) {
    try {
      const result = await this.$axios.$get(
        parentPostId
          ? `${ENDPOINT_POSTS}/${parentPostId}/children/${postId}/comments`
          : `${ENDPOINT_POSTS}/${postId}/comments`,
        {
          params,
        }
      );

      if (!result.error) {
        const { data = [] } = result;

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, {
          ...state.post,
          $commentTree: [
            ...state.post.$commentTree,
            ...data.map((comment) => ({
              ...comment,
              $children: [],
            })),
          ],
        });
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.ADD_COMMENT](
    { state, commit },
    { postId, parentPostId, model = {} } = {}
  ) {
    try {
      const result = await this.$axios.$post(
        parentPostId
          ? `${ENDPOINT_POSTS}/${parentPostId}/children/${postId}/comments`
          : `${ENDPOINT_POSTS}/${postId}/comments`,
        model
      );

      if (!result.error) {
        const { data = {} } = result;

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, {
          ...state.post,
          $commentTree: [
            { ...data, $children: [] },
            ...state.post.$commentTree,
          ],
        });
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.EDIT_COMMENT](
    { state, commit },
    { parentPostId, postId, commentId, model } = {}
  ) {
    try {
      const result = await this.$axios.$patch(
        parentPostId
          ? `${ENDPOINT_POSTS}/${parentPostId}/children/${postId}/comments/${commentId}`
          : `${ENDPOINT_POSTS}/${postId}/comments/${commentId}`,
        model
      );

      if (!result.error) {
        const newPost = {
          ...state.post,
          $commentTree: state.post.$commentTree.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                ...(result.data || {}),
              };
            }

            return comment;
          }),
        };

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, newPost);
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.DELETE_COMMENT](
    { state, commit },
    { parentPostId, postId, id } = {}
  ) {
    try {
      const result = await this.$axios.$delete(
        parentPostId
          ? `${ENDPOINT_POSTS}/${parentPostId}/children/${postId}/comments/${id}`
          : `${ENDPOINT_POSTS}/${postId}/comments/${id}`
      );

      if (!result.error) {
        const { post = {} } = state;
        const deletedComment = state.post.$commentTree.find(
          (comment) => comment.id === id
        );
        const commentChildCount = deletedComment.$children
          ? deletedComment.$children.length
          : 0;
        const newPost = {
          ...post,
          counter: {
            ...post.counter,
            comment: post.counter.comment - (commentChildCount + 1),
          },
          $commentTree: post.$commentTree.filter(
            (comment) => comment.id !== id
          ),
        };

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.LIKE_COMMENT](
    { state, commit },
    { parentPostId, postId, commentId, model = {} } = {}
  ) {
    try {
      const result = await this.$axios.$post(
        parentPostId
          ? `${ENDPOINT_POSTS}/${parentPostId}/children/${postId}/comments/${commentId}/reactions`
          : `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/reactions`,
        model
      );

      if (!result.error) {
        const { data = {} } = result;
        const { post = {} } = state;

        const newCommentTree = post.$commentTree.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              counter: {
                ...comment.counter,
                reaction: comment.counter.reaction + 1,
              },
              reaction: {
                created_at: data.created_at,
                emoji: data.emoji,
              },
            };
          }
          return comment;
        });

        const newPost = {
          ...post,
          $commentTree: newCommentTree,
        };

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.DELETE_LIKE_COMMENT](
    { state, commit },
    { parentPostId, postId, commentId, model = {} } = {}
  ) {
    try {
      const result = await this.$axios.$request({
        url: parentPostId
          ? `${ENDPOINT_POSTS}/${parentPostId}/children/${postId}/comments/${commentId}/reactions`
          : `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/reactions`,
        data: model,
        method: "DELETE",
      });

      if (!result.error) {
        const { post = {} } = state;

        const newCommentTree = post.$commentTree.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              counter: {
                ...comment.counter,
                reaction: comment.counter.reaction - 1,
              },
              reaction: null,
            };
          }
          return comment;
        });

        const newPost = {
          ...post,
          $commentTree: newCommentTree,
        };

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.GET_CHILD_COMMENT](
    { state, commit },
    { postId, commentId, fromId, size } = {}
  ) {
    try {
      const result = await this.$axios.$get(
        `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/comments`,
        {
          params: { from_comment_id: fromId, fetch_size: size },
        }
      );

      if (!result.error) {
        const { data = [] } = result;
        const { post = {} } = state;

        const newCommentTree = post.$commentTree.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              $children: [...comment.$children, ...data],
            };
          } else {
            return comment;
          }
        });

        const newPost = {
          ...post,
          $commentTree: newCommentTree,
        };

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.ADD_CHILD_COMMENT](
    { state, commit },
    { postId, commentId, model } = {}
  ) {
    try {
      const result = await this.$axios.$post(
        `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/comments`,
        model
      );

      if (!result.error) {
        const { data = {} } = result;
        const { post = {} } = state;

        const newPost = {
          ...post,
          $commentTree: post.$commentTree.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                $children: [data, ...comment.$children],
              };
            }
            return comment;
          }),
        };

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.EDIT_CHILD_COMMENT](
    { state, commit },
    { postId, parentCommentId, commentId, model } = {}
  ) {
    try {
      const result = await this.$axios.$patch(
        `${ENDPOINT_POSTS}/${postId}/comments/${parentCommentId}/comments/${commentId}`,
        model
      );

      if (!result.error) {
        const { post = {} } = state;

        const newCommentTree = post.$commentTree.map((comment) => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              $children: comment.$children.map((item) => {
                if (item.id === commentId) {
                  return {
                    ...comment,
                    ...(result.data || {}),
                  };
                }
                return item;
              }),
            };
          }
          return comment;
        });

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, {
          ...state.post,
          $commentTree: newCommentTree,
        });
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.DELETE_CHILD_COMMENT](
    { state, commit },
    { id, postId, parentCommentId } = {}
  ) {
    try {
      const result = await this.$axios.$delete(
        `${ENDPOINT_POSTS}/${postId}/comments/${parentCommentId}/comments/${id}`
      );

      if (!result.error) {
        const { post = {} } = state;
        const newCommentTree = post.$commentTree.map((comment) => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              counter: {
                ...comment.counter,
                comment: comment.counter.comment - 1,
              },
              $children: comment.$children.filter((item) => item.id !== id),
            };
          }

          return comment;
        });

        const newPost = {
          ...post,
          counter: {
            ...post.counter,
            comment: post.counter.comment - 1,
          },
          $commentTree: newCommentTree,
        };

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.LIKE_CHILD_COMMENT](
    { state, commit },
    { postId, parentCommentId, commentId, model = {} } = {}
  ) {
    try {
      const result = await this.$axios.$post(
        `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/reactions`,
        model
      );

      if (!result.error) {
        const { data = {} } = result;
        const { post = {} } = state;

        const newCommentTree = post.$commentTree.map((comment) => {
          if (comment.id === parentCommentId) {
            const newChildren = comment.$children.map((item) => {
              if (item.id === commentId) {
                return {
                  ...item,
                  counter: {
                    ...item.counter,
                    reaction: item.counter.reaction + 1,
                  },
                  reaction: {
                    created_at: data.created_at,
                    emoji: data.emoji,
                  },
                };
              }
              return item;
            });

            return {
              ...comment,
              $children: newChildren,
            };
          }
          return comment;
        });

        const newPost = {
          ...post,
          $commentTree: newCommentTree,
        };

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.DELETE_LIKE_CHILD_COMMENT](
    { state, commit },
    { postId, parentCommentId, commentId, model = {} } = {}
  ) {
    try {
      const result = await this.$axios.$request({
        url: `${ENDPOINT_POSTS}/${postId}/comments/${commentId}/reactions`,
        data: model,
        method: "DELETE",
      });

      if (!result.error) {
        const { post = {} } = state;

        const newCommentTree = post.$commentTree.map((comment) => {
          if (comment.id === parentCommentId) {
            const newChildren = comment.$children.map((item) => {
              if (item.id === commentId) {
                return {
                  ...item,
                  counter: {
                    ...item.counter,
                    reaction: item.counter.reaction - 1,
                  },
                  reaction: null,
                };
              }
              return item;
            });

            return {
              ...comment,
              $children: newChildren,
            };
          }
          return comment;
        });

        const newPost = {
          ...post,
          $commentTree: newCommentTree,
        };

        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, newPost);
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.MODAL_POST_DETAIL.EDIT_POST_TAGS](
    { state, commit },
    { postId, mainPostId, tags } = {}
  ) {
    try {
      const result = await this.$axios.$put(
        `${ENDPOINT_POSTS}/${
          mainPostId ? `${mainPostId}/children/` : ""
        }${postId}/tags`,
        { tags }
      );

      if (!result.error) {
        const { post = {} } = state;
        commit(mutationTypes.MODAL_POST_DETAIL.SET_POST, {
          ...post,
          tags: [...(result.data || [])],
        });
      }

      return result;
    } catch (error) {
      return error;
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.MODAL_POST_DETAIL.SET_POST](state, _post) {
    state.post = _post;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
