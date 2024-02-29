#version 330 compatibility

out vec2 vST; // texture coords
out vec3  vXYZ;
uniform float uMorph;

out vec3 vN; // normal vector
out vec3 vL; // vector from point to light
out vec3 vE; // vector from point to eye

const float TWOPI = 2.*3.14159265;
const vec3 LIGHTPOSITION = vec3( 5., 5., 0. );

void
main( )
{
	vST = gl_MultiTexCoord0.st;
	vXYZ = gl_Vertex.xyz;
	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex; // eye coordinate 

	vec4 vertex = gl_Vertex;
	vec3 normal0 = gl_Normal;
	vec3 normal = gl_Normal;

		if (vXYZ.y >= 12. && vXYZ.x >= 3.85 || vXYZ.z <= -5. && vXYZ.x >= 3.)
		{	
			vec4 newVertex = gl_Vertex;
			// newVertex.xyz *= 16. / length(vertex.xyz);

			float angle = 0.7;
			newVertex.xy *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));		// from https://www.youtube.com/watch?v=ssqTWRQwXVo
			newVertex.x += 10.;

			vertex = mix(gl_Vertex, newVertex, -uMorph);
		} else if (vXYZ.y >= 12. && -vXYZ.x >= 3.85 || vXYZ.z <= -5. && -vXYZ.x >= 3.)
		{
			vec4 newVertex = gl_Vertex;
			// newVertex.xyz *= 16. / length(vertex.xyz);

			float angle = -0.7;
			newVertex.xy *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));		// from https://www.youtube.com/watch?v=ssqTWRQwXVo
			newVertex.x -= 10.;

			vertex = mix(gl_Vertex, newVertex, -uMorph);
		}


	vN = normalize( gl_NormalMatrix * normal ); // normal vector
	vL = LIGHTPOSITION - ECposition.xyz; // vector from the point to the light 
	vE = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point to the eye position 
	// gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
	gl_Position = gl_ModelViewProjectionMatrix * vertex;
}