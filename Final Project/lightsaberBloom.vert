#version 330 compatibility
out vec2 vST; // texture coords
out vec3 vN; // normal vector
out vec3 vL; // vector from point to light
out vec3 vE; // vector from point to eye
out vec3 vMCposition;

uniform float uBlurRadius;

const vec3 LIGHTPOSITION = vec3( 5., 5., 0. );
mat4 ModelViewMatrix;

void
main( )
{
	vST = gl_MultiTexCoord0.st;
	vMCposition = gl_Vertex.xyz;

	vec4 vertex = gl_Vertex;

	// if (vMCposition.x > 7.2) {
		// vertex.y = gl_Vertex.y * (uBlurRadius);
		// vertex.z = gl_Vertex.z * (uBlurRadius);
	//	ModelViewMatrix = (gl_ModelViewMatrix + (uBlurRadius));
	//} else {
	//	ModelViewMatrix = gl_ModelViewMatrix;
	//}

	// vMCposition = vertex.xyz;


	vec4 ECposition = ModelViewMatrix * vertex; // eye coordinate position
	vN = normalize( gl_NormalMatrix * gl_Normal ); // normal vector
	vL = LIGHTPOSITION - ECposition.xyz; // vector from the point to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * vertex;
}